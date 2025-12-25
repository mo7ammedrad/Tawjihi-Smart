import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const checkCourseBelongToTeacherInCreate = asyncErrorHandler(async (req, res, next) => {
	const course = await Course.findById(req.body.course);
	if (req.user.id !== course.teacher.id)
		throw new CustomError(req.__('lessons.cannot_add_lecture_to_unowned_course'), 403);
	next();
});

export const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	const lesson = await Lesson.findById(req.params.id);
	const course = await Course.findById(lesson.course);
	if (req.user.id !== course.teacher.id)
		throw new CustomError(req.__('lessons.lesson_on_unowned_course'), 403);
	next();
});

export const addCourseIdToReqBody = (req, res, next) => {
	if (req.params.courseId) req.body.course = req.params.courseId;
	next();
};

export const addCourseIdToReqQuery = (req, res, next) => {
	if (req.params.courseId) req.query.course = req.params.courseId;
	next();
};
