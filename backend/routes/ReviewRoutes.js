import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	addUserIdToReqBody,
	addCourseIdToReqBody,
	deleteReviewMiddleware,
	addCourseIdToReqQuery,
} from '../middlewares/reviewMiddleware.js';

import {
	createReviewValidator,
	getReviewValidator,
	updateReviewValidator,
	deleteReviewValidator,
} from '../utils/validators/reviewValidator.js';

import {
	getAllReviews,
	createReview,
	getReview,
	updateReview,
	deleteReview,
} from '../controllers/ReviewController.js';

const router = express.Router({ mergeParams: true });

// Routes for Review
router
	.route('/')
	.get(addCourseIdToReqQuery, getAllReviews)
	.post(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addCourseIdToReqBody,
		createReviewValidator,
		createReview,
	);

router
	.route('/:id')
	.get(getReviewValidator, getReview)
	.patch(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addCourseIdToReqBody,
		updateReviewValidator,
		updateReview,
	)
	.delete(protect, deleteReviewValidator, deleteReviewMiddleware, deleteReview);

export default router;
