import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	addUserIdToReqBody,
	addTeacherIdToReqBody,
	deleteTeacherReviewMiddleware,
	addTeacherIdToReqQuery,
} from '../middlewares/teacherReviewMiddleware.js';

import {
	createTeacherReviewValidator,
	getTeacherReviewValidator,
	updateTeacherReviewValidator,
	deleteTeacherReviewValidator,
} from '../utils/validators/teacherReviewValidator.js';

import {
	getAllTeacherReviews,
	createTeacherReview,
	getTeacherReview,
	updateTeacherReview,
	deleteTeacherReview,
} from '../controllers/TeacherReviewController.js';

const router = express.Router({ mergeParams: true });

// Routes for TeacherReview
router
	.route('/')
	.get(addTeacherIdToReqQuery, getAllTeacherReviews)
	.post(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addTeacherIdToReqBody,
		createTeacherReviewValidator,
		createTeacherReview,
	);

router
	.route('/:id')
	.get(getTeacherReviewValidator, getTeacherReview)
	.patch(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addTeacherIdToReqBody,
		updateTeacherReviewValidator,
		updateTeacherReview,
	)
	.delete(
		protect,
		allowedTo('user', 'admin'),
		deleteTeacherReviewValidator,
		deleteTeacherReviewMiddleware,
		deleteTeacherReview,
	);

export default router;
