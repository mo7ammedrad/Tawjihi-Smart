import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	createNewValidator,
	updateNewValidator,
	getNewValidator,
	deleteNewValidator,
} from '../utils/validators/newsValidator.js';

import {
	getAllNews,
	createNew,
	getNew,
	updateNew,
	deleteNew,
	uploadNewCoverImage,
	handleNewCoverImage,
} from '../controllers/NewController.js';

const router = express.Router();

router
	.route('/')
	.get(getAllNews)
	.post(
		protect,
		allowedTo('admin'),
		uploadNewCoverImage,
		handleNewCoverImage,
		createNewValidator,
		createNew,
	);

router
	.route('/:id')
	.get(getNewValidator, getNew)
	.patch(
		protect,
		allowedTo('admin'),
		uploadNewCoverImage,
		handleNewCoverImage,
		updateNewValidator,
		updateNew,
	)
	.delete(protect, allowedTo('admin'), deleteNewValidator, deleteNew);

export default router;
