import Comment from '../models/Comment.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const addLessonIdToReqQuery = (req, res, next) => {
	if (req.params.lessonId) req.query.lesson = req.params.lessonId;
	next();
};

export const addLessonIdToReqBody = (req, res, next) => {
	if (req.params.lessonId) {
		req.body.lesson = req.params.lessonId;
	}
	next();
};

export const addUserIdToReqBody = (req, res, next) => {
	req.body.user = req.user.id;
	next();
};

export const checkCommentBelongToUser = asyncErrorHandler(async (req, res, next) => {
	if (req.user.role === 'user') {
		const comment = await Comment.findById(req.params.id);
		if (comment)
			if (comment.user.id !== req.user.id)
				throw new CustomError(req.__('comments.comment_does_not_belong_to_you'), 403);
	}
	next();
});

export const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	if (req.user.role === 'teacher') {
		const comment = await Comment.findById(req.params.id);
		if (comment) {
			const lesson = await Lesson.findById(comment.lesson.id);
			if (lesson) {
				const course = await Course.findById(lesson.course);
				if (course.teacher.id !== req.user.id)
					throw new CustomError(req.__('comments.comment_on_unowned_course'), 403);
			}
		}
	}
	next();
});
