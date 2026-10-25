import { GoogleGenAI } from '@google/genai';
import { env } from '@/config/env';
import { prisma } from '@/config/database';
import { AppError } from '@/common/errors/AppError';
import { ErrorCodes } from '@/common/errors/ErrorCodes';
import { logger } from '@/config/logger';

export class MockInterviewService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  private async generateWithFallback(contents: any, config?: any) {
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
          contents,
          config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        logger.warn({ err: err?.message || err, model }, `Mock interview model ${model} failed, trying next...`);
      }
    }
    throw lastError;
  }

  /**
   * Generates dynamic role-specific technical & behavioral interview questions
   */
  async generateQuestions(userId: string, role: string, difficulty: string = 'JUNIOR') {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        userSkills: { include: { skill: true } }
      }
    });

    const studentSkills = profile?.userSkills.map((s: any) => s.skill.name).join(', ') || 'General Software Engineering';

    const prompt = `
You are a Staff Software Engineer and Hiring Manager conducting an interview for the role of "${role}" (Difficulty: ${difficulty}).
The candidate has listed skills in: ${studentSkills}.

Generate 4 realistic, progressive interview questions in JSON format:
1. Technical Concept Question (testing deep fundamental understanding)
2. Practical Coding / System Design Scenario Question (real-world challenge)
3. Behavioral Question (evaluating teamwork, ownership, or conflict resolution using the STAR method)
4. Problem-Solving / Edge Case Scenario Question

Strictly output ONLY valid JSON in this exact structure:
{
  "role": "${role}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "category": "TECHNICAL_CORE",
      "question": "Question text here...",
      "expectedKeyPoints": ["Point 1", "Point 2", "Point 3"]
    },
    {
      "id": 2,
      "category": "SYSTEM_SCENARIO",
      "question": "Scenario question here...",
      "expectedKeyPoints": ["Point 1", "Point 2"]
    },
    {
      "id": 3,
      "category": "BEHAVIORAL_STAR",
      "question": "Behavioral question here...",
      "expectedKeyPoints": ["Situation/Task clarity", "Action taken", "Measurable result"]
    },
    {
      "id": 4,
      "category": "EDGE_CASE",
      "question": "Edge case / troubleshooting question here...",
      "expectedKeyPoints": ["Root cause analysis", "Testing methodology"]
    }
  ]
}
`;

    try {
      const response = await this.generateWithFallback(prompt);
      const cleaned = (response.text || '{}')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (error) {
      logger.error({ error }, 'Failed to generate interview questions');
      // Fallback default questions if Gemini quota is unavailable
      return {
        role,
        difficulty,
        questions: [
          {
            id: 1,
            category: 'TECHNICAL_CORE',
            question: `How would you explain the architectural difference between synchronous and asynchronous execution in modern web applications for ${role}?`,
            expectedKeyPoints: ['Event Loop', 'Non-blocking I/O', 'Thread management']
          },
          {
            id: 2,
            category: 'SYSTEM_SCENARIO',
            question: 'Imagine a critical API endpoint starts experiencing a 10x spike in latency. Walk through your step-by-step diagnostic workflow.',
            expectedKeyPoints: ['Telemetry/APM inspection', 'Database queries & indexing', 'Cache hit rates']
          },
          {
            id: 3,
            category: 'BEHAVIORAL_STAR',
            question: 'Describe a project where you faced a significant technical roadblock close to a deadline. How did you prioritize and deliver?',
            expectedKeyPoints: ['Clear context (Situation)', 'Ownership (Action)', 'Quantifiable result (Result)']
          }
        ]
      };
    }
  }

  /**
   * Evaluates a candidate's answer with detailed constructive feedback & score
   */
  async evaluateAnswer(params: {
    role: string;
    question: string;
    userAnswer: string;
    expectedKeyPoints?: string[];
  }) {
    const prompt = `
You are an expert technical interviewer evaluating a student candidate for a ${params.role} position.

Question Asked:
"${params.question}"

Candidate Answer:
"${params.userAnswer}"

Expected Concepts:
${(params.expectedKeyPoints || []).join(', ')}

Please evaluate the answer thoroughly and return ONLY valid JSON:
{
  "score": <number from 0 to 100>,
  "technicalAccuracy": <number from 0 to 100>,
  "communicationClarity": <number from 0 to 100>,
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "idealAnswerSummary": "A concise example of what a 100/100 senior candidate would emphasize."
}
`;

    try {
      const response = await this.generateWithFallback(prompt);
      const cleaned = (response.text || '{}')
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const feedback = JSON.parse(cleaned);
      return feedback;
    } catch (error) {
      logger.error({ error }, 'Failed to evaluate interview answer');
      return {
        score: 75,
        technicalAccuracy: 75,
        communicationClarity: 75,
        strengths: ['Addressed the main question prompt clearly.'],
        improvements: ['Include more concrete technical metrics and real-world trade-off considerations.'],
        idealAnswerSummary: 'Frame your response using concrete engineering constraints, trade-offs, and measurable outcomes.'
      };
    }
  }
}

export const mockInterviewService = new MockInterviewService();
