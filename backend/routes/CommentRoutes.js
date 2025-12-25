import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	addUserIdToReqBody,
	addLessonIdToReqBody,
	checkCommentBelongToUser,
	checkCourseBelongToTeacher,
	addLessonIdToReqQuery,
} from '../middlewares/commentMiddleware.js';

import {
	createCommentValidator,
	getCommentValidator,
	updateCommentValidator,
	deleteCommentValidator,
} from '../utils/validators/commentValidator.js';

import {
	getAllComments,
	createComment,
	getComment,
	updateComment,
	deleteComment,
} from '../controllers/CommentController.js';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(addLessonIdToReqQuery, getAllComments)
	.post(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addLessonIdToReqBody,
		createCommentValidator,
		createComment,
	);

router
	.route('/:id')
	.get(getCommentValidator, getComment)
	.patch(
		protect,
		allowedTo('user'),
		addUserIdToReqBody,
		addLessonIdToReqBody,
		checkCommentBelongToUser,
		updateCommentValidator,
		updateComment,
	)
	.delete(
		protect,
		allowedTo('user', 'teacher'),
		addLessonIdToReqBody,
		checkCommentBelongToUser,
		checkCourseBelongToTeacher,
		deleteCommentValidator,
		deleteComment,
	);

export default router;
