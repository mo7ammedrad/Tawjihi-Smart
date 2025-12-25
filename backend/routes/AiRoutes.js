import express from 'express';
import { generateAiQuiz } from '../controllers/AiController.js';
import { chatWithAi } from '../controllers/AiChatController.js';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { aiGenerateRateLimit, aiChatRateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/quiz/generate', protect, allowedTo('teacher'), aiGenerateRateLimit, generateAiQuiz);
router.post('/chat', protect, allowedTo('user'), aiChatRateLimit, chatWithAi);

export default router;
