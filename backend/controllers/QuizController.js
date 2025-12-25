import Quiz from '../models/Quiz.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const updateQuiz = asyncErrorHandler(async (req, res) => {
	const { id } = req.params;
	const { questions, status, tags, language, difficulty, title } = req.body;

	const quiz = await Quiz.findById(id);
	if (!quiz) throw new CustomError('Quiz not found.', 404);
	if (String(quiz.teacher) !== String(req.user?._id)) {
		throw new CustomError('Forbidden: not your quiz.', 403);
	}

	if (questions) {
		if (!Array.isArray(questions)) throw new CustomError('questions must be an array.', 400);
		quiz.questions = questions;
	}
	if (status) {
		if (!['draft', 'published'].includes(status)) throw new CustomError('Invalid status.', 400);
		if (status === 'published' && (!quiz.questions || quiz.questions.length === 0)) {
			throw new CustomError('Cannot publish without questions.', 400);
		}
		quiz.status = status;
	}
	if (tags) quiz.tags = tags;
	if (language) quiz.language = language;
	if (difficulty) quiz.difficulty = difficulty;
	if (title) quiz.title = title;

	await quiz.save();

	return res.json({
		quizId: quiz._id,
		status: quiz.status,
		questions: quiz.questions,
	});
});

export const getQuiz = asyncErrorHandler(async (req, res) => {
	const quiz = await Quiz.findById(req.params.id)
		.populate('course', 'name _id')
		.populate('lesson', 'name _id')
		.populate('teacher', 'name _id');

	if (!quiz) throw new CustomError('Quiz not found.', 404);
	if (String(quiz.teacher?._id) !== String(req.user?._id)) {
		throw new CustomError('Forbidden: not your quiz.', 403);
	}

	return res.json({ quiz });
});

export const listMyQuizzes = asyncErrorHandler(async (req, res) => {
	const quizzes = await Quiz.find({ teacher: req.user?._id })
		.sort({ createdAt: -1 })
		.select('-__v');
	return res.json({ quizzes });
});

export const listPublishedByLesson = asyncErrorHandler(async (req, res) => {
	const { courseId, lessonId } = req.query;
	if (!courseId || !lessonId) {
		throw new CustomError('courseId and lessonId are required.', 400);
	}
	const quizzes = await Quiz.find({
		course: courseId,
		lesson: lessonId,
		status: 'published',
	})
		.sort({ createdAt: -1 })
		.select('-__v');

	return res.json({ quizzes });
});
