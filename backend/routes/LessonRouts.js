import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	checkCourseBelongToTeacher,
	checkCourseBelongToTeacherInCreate,
	addCourseIdToReqBody,
	addCourseIdToReqQuery,
} from '../middlewares/lessonMiddleware.js';

import {
	createLessonValidator,
	getLessonValidator,
	updateLessonValidator,
	deleteLessonValidator,
} from '../utils/validators/lessonValidator.js';

import {
	getAllLessons,
	createLesson,
	getLesson,
	updateLesson,
	deleteLesson,
	uploadLessonVideo,
	handleVideo,
} from '../controllers/LessonController.js';

import resourceRouts from './ResourceRouts.js';
import commentsRouts from './CommentRoutes.js';

const router = express.Router({ mergeParams: true });

router.use('/:lessonId/resources', resourceRouts);
router.use('/:lessonId/comments', commentsRouts);

router
	.route('/')
	.get(addCourseIdToReqQuery, getAllLessons)
	.post(
		protect,
		allowedTo('teacher'),
		uploadLessonVideo,
		handleVideo,
		addCourseIdToReqBody,
		createLessonValidator,
		checkCourseBelongToTeacherInCreate,
		createLesson,
	);

router
	.route('/:id')
	.get(getLessonValidator, getLesson)
	.patch(
		protect,
		allowedTo('teacher'),
		checkCourseBelongToTeacher,
		uploadLessonVideo,
		handleVideo,
		addCourseIdToReqBody,
		updateLessonValidator,
		updateLesson,
	)
	.delete(
		protect,
		allowedTo('teacher'),
		addCourseIdToReqBody,
		checkCourseBelongToTeacher,
		deleteLessonValidator,
		deleteLesson,
	);

export default router;
