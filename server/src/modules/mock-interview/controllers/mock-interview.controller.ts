import { Request, Response } from 'express';
import { mockInterviewService } from '../services/mock-interview.service';
import { successResponse } from '@/common/utils/response';
import { asyncHandler } from '@/common/utils/asyncHandler';

export class MockInterviewController {
  generateQuestions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const role = (req.query.role as string) || 'Full Stack Engineer';
    const difficulty = (req.query.difficulty as string) || 'JUNIOR';

    const sessionData = await mockInterviewService.generateQuestions(userId, role, difficulty);
    res.json(successResponse(sessionData, 'Interview questions generated successfully'));
  });

  evaluateAnswer = asyncHandler(async (req: Request, res: Response) => {
    const { role, question, userAnswer, expectedKeyPoints } = req.body;
    const evaluation = await mockInterviewService.evaluateAnswer({
      role: role || 'Software Engineer',
      question,
      userAnswer,
      expectedKeyPoints,
    });

    res.json(successResponse(evaluation, 'Answer evaluated successfully'));
  });
}

export const mockInterviewController = new MockInterviewController();
