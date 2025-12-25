import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import {
	getQuiz,
	listMyQuizzes,
	updateQuiz,
	listPublishedByLesson,
} from '../controllers/QuizController.js';

const router = express.Router();

router.get(
	'/public/by-lesson',
	protect,
	allowedTo('user', 'teacher', 'admin'),
	listPublishedByLesson,
);
router.get('/my', protect, allowedTo('teacher'), listMyQuizzes);
router.get('/:id', protect, allowedTo('teacher'), getQuiz);
router.put('/:id', protect, allowedTo('teacher'), updateQuiz);

export default router;
