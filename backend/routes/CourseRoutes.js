import express from 'express';
import lessonRouts from './LessonRouts.js';
import reviewsRouts from './ReviewRoutes.js';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	checkCourseBelongToTeacher,
	normalizeCourseFields,
} from '../middlewares/courseMiddleware.js';

import {
	createCourseValidator,
	updateCourseValidator,
	getCourseValidator,
	deleteCourseValidator,
} from '../utils/validators/courseValidator.js';

import {
	getAllCourses,
	createCourse,
	getCourse,
	updateCourse,
	deleteCourse,
	uploadCourseImage,
	handleCourseImage,
} from '../controllers/CourseController.js';

const router = express.Router();

router.use('/:courseId/lessons', lessonRouts);

router.use('/:courseId/reviews', reviewsRouts);

router
	.route('/')
	.get(getAllCourses)
	.post(
		protect,
		allowedTo('teacher', 'admin'),
		uploadCourseImage,
		handleCourseImage,
		normalizeCourseFields,
		createCourseValidator,
		createCourse,
	);

router
	.route('/:id')
	.get(getCourseValidator, getCourse)
	.patch(
		protect,
		allowedTo('teacher', 'admin'),
		uploadCourseImage,
		handleCourseImage,
		normalizeCourseFields,
		updateCourseValidator,
		checkCourseBelongToTeacher,
		updateCourse,
	)
	.delete(
		protect,
		allowedTo('teacher', 'admin'),
		deleteCourseValidator,
		checkCourseBelongToTeacher,
		deleteCourse,
	);

export default router;
