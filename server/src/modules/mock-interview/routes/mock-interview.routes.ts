import { Router } from 'express';
import { mockInterviewController } from '../controllers/mock-interview.controller';
import { requireAuth } from '@/common/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/questions', mockInterviewController.generateQuestions);
router.post('/evaluate', mockInterviewController.evaluateAnswer);

export const mockInterviewRoutes = router;
