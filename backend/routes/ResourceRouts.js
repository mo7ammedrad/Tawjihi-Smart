import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import { checkResourceBelongToTeacher } from '../middlewares/resourceMiddleware.js';

import {
	getAllResourceValidator,
	createResourceValidator,
	getResourceValidator,
	updateResourceValidator,
	deleteResourceValidator,
} from '../utils/validators/resourceValidator.js';

import {
	getAllResource,
	createResource,
	getResource,
	updateResource,
	deleteResource,
	uploadContentFile,
	handleContentFile,
} from '../controllers/ResourceController.js';

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(getAllResourceValidator, getAllResource)
	.post(
		protect,
		allowedTo('teacher'),
		uploadContentFile,
		handleContentFile,
		checkResourceBelongToTeacher,
		createResourceValidator,
		createResource,
	);

router
	.route('/:id')
	.get(getResourceValidator, getResource)
	.patch(
		protect,
		allowedTo('teacher'),
		uploadContentFile,
		handleContentFile,
		checkResourceBelongToTeacher,
		updateResourceValidator,
		updateResource,
	)
	.delete(
		protect,
		allowedTo('teacher'),
		checkResourceBelongToTeacher,
		deleteResourceValidator,
		deleteResource,
	);

export default router;
