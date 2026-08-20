import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env';
import { prisma } from '@/config/database';
import { AppError } from '@/common/errors/AppError';
import { ErrorCodes } from '@/common/errors/ErrorCodes';
import { profileService } from '@/modules/profiles/services/profile.service';
import { logger } from '@/config/logger';

export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  /**
   * Helper that executes generateContent with multiple fallback models to handle transient provider outages/spikes.
   */
  private async generateContentWithFallback(params: {
    contents: any;
    config?: any;
  }) {
    const candidateModels = [
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-flash-lite-latest',
    ];

    let lastError: any = null;
    for (const model of candidateModels) {
      try {
        const response = await this.ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        logger.warn({ err: err?.message || err, model }, `Gemini model ${model} failed, attempting next candidate...`);
      }
    }
    throw lastError;
  }

  /**
   * Multimodal PDF text and content extraction using Gemini Vision/Document OCR
   */
  async extractTextFromPdfBuffer(pdfBuffer: Buffer): Promise<string> {
    const base64Data = pdfBuffer.toString('base64');
    const response = await this.generateContentWithFallback({
      contents: [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: base64Data,
          },
        },
        {
          text: 'Transcribe and extract all textual content, explanations, formulas, definitions, questions, and notes from this document thoroughly and completely. Retain structure, headings, and detailed information accurately.',
        },
      ],
    });
    return response.text || '';
  }

  /**
   * Generates a 768-dimensional vector embedding for the given text using Gemini.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
      config: {
        outputDimensionality: 768,
      }
    });
    
    if (!response.embeddings || response.embeddings.length === 0) {
      throw new Error('Failed to generate embedding');
    }

    return response.embeddings[0].values!;
  }

  /**
   * AI Career Mentor chat logic.
   * Feeds the user's CareerOS profile as system instructions.
   */
  async chat(userId: string, message: string, sessionId?: string) {
    const profile = await profileService.getProfile(userId).catch(() => null);

    let session;
    if (sessionId) {
      session = await prisma.mentorSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
      if (!session || session.userId !== userId) {
        throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Session not found');
      }
    } else {
      session = await prisma.mentorSession.create({
        data: { userId, title: 'Career Mentorship' },
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        mentorSessionId: session.id,
        role: 'USER',
        content: message,
      },
    });

    // Build conversation history for Gemini
    const contents = session.messages.map((m) => ({
      role: m.role === 'USER' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    // Append new user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Build System Instructions
    let systemInstruction = 'You are an expert AI Career Mentor for college students. Be encouraging, highly technical, and concise. Do not ask the user for their major, university, or goals if they are not provided.';
    if (profile) {
      systemInstruction = `You are an expert AI Career Mentor for a college student named ${profile.firstName} ${profile.lastName}.`;
      if (profile.college || profile.branch) {
        systemInstruction += ` They are studying ${profile.branch || 'a degree'} at ${profile.college || 'university'}.`;
      }
      if (profile.careerGoals && profile.careerGoals.length > 0) {
        systemInstruction += ` Their career goals: ${profile.careerGoals.map((g: any) => g.title).join(', ')}.`;
      }
      systemInstruction += ' Be encouraging, highly technical, and strictly focus on helping them achieve their career goals. Keep responses concise. If some profile information is missing, do NOT ask the user to provide it.';
    }

    const response = await this.generateContentWithFallback({
      contents,
      config: {
        systemInstruction,
      },
    });

    const aiMessageText = response.text || 'I am sorry, I could not process that request.';

    // Save AI message
    await prisma.chatMessage.create({
      data: {
        mentorSessionId: session.id,
        role: 'AI',
        content: aiMessageText,
      },
    });

    return {
      sessionId: session.id,
      reply: aiMessageText,
    };
  }

  /**
   * RAG Chat logic: Finds relevant document chunks using vector similarity,
   * then asks Gemini to answer based on the context.
   */
  async chatWithDocument(userId: string, documentId: string, message: string) {
    const doc = await prisma.studyDocument.findUnique({ where: { id: documentId } });
    if (!doc || doc.userId !== userId) {
      throw new AppError(404, ErrorCodes.RESOURCE_NOT_FOUND, 'Document not found');
    }
    if (doc.status !== 'READY') {
      throw new AppError(400, ErrorCodes.BAD_REQUEST, 'Document is still processing');
    }

    // 1. Embed the user's query
    const queryEmbedding = await this.generateEmbedding(message);
    const vectorLiteral = `[${queryEmbedding.join(',')}]`;

    // 2. Perform Cosine Similarity Search using pgvector
    const relevantChunks = await prisma.$queryRaw<Array<{ content: string; distance: number }>>`
      SELECT content, embedding <=> ${vectorLiteral}::vector AS distance
      FROM "DocumentChunk"
      WHERE "studyDocumentId" = ${documentId}
      ORDER BY distance ASC
      LIMIT 8;
    `;

    // 3. If total chunks in document is small (<= 15), provide complete document context so broad queries like "explain it" or "generate quiz" work flawlessly
    const allChunks = await prisma.documentChunk.findMany({
      where: { studyDocumentId: documentId },
      select: { content: true },
      take: 15,
    });

    let contextChunks = relevantChunks;
    if (allChunks.length <= 15) {
      contextChunks = allChunks.map(c => ({ content: c.content, distance: 0 }));
    }

    if (!contextChunks || contextChunks.length === 0) {
      return { reply: "I couldn't find any readable text in this document. Please try uploading the document again." };
    }

    // 4. Construct the prompt with retrieved context
    const contextText = contextChunks.map(c => c.content).join('\n\n---\n\n');
    
    const prompt = `
You are an expert AI Study Assistant, Tutor, and Academic Mentor.
Your role is to help the student learn and understand their uploaded document ("${doc.filename}").

Document Context:
\"\"\"
${contextText}
\"\"\"

Student Query: ${message}

Guidelines:
1. Explain concepts, summarize chapters, answer questions, and generate study quizzes/flashcards directly using the document context above.
2. If the user asks general questions like "explain it", "what is this document about?", "give me a summary", or "generate a quiz", provide a structured, in-depth, and clear explanation covering the main topics and takeaways from the document context.
3. If the user says a greeting (like "hi", "hello"), greet them warmly and highlight the main topics covered in "${doc.filename}".
4. If the user asks something completely outside the scope of the document, kindly guide them back to the topics in this document.
`;

    // 5. Generate answer with fallback
    const response = await this.generateContentWithFallback({
      contents: prompt,
    });

    return {
      reply: response.text || 'I analyzed the document, but could not produce a response. Please ask a specific question.',
    };
  }
}

export const aiService = new AiService();
