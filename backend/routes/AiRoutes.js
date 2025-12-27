import express from 'express';
import { generateAiQuiz, generateSelfPracticeQuiz } from '../controllers/AiController.js';
import { chatWithAi, uploadChatAttachments } from '../controllers/AiChatController.js';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import { aiGenerateRateLimit, aiChatRateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/quiz/generate', protect, allowedTo('teacher'), aiGenerateRateLimit, generateAiQuiz);
router.post(
	'/chat',
	protect,
	allowedTo('user'),
	aiChatRateLimit,
	uploadChatAttachments,
	chatWithAi,
);
router.post(
	'/quiz/self',
	protect,
	allowedTo('user', 'teacher', 'admin'),
	aiGenerateRateLimit,
	generateSelfPracticeQuiz,
);

export default router;
