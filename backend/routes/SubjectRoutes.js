import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	getSubjectValidator,
	createSubjectValidator,
	updateSubjectValidator,
	deleteSubjectValidator,
} from '../utils/validators/subjectValidator.js';

import {
	getAllSubjects,
	createSubject,
	getSubject,
	updateSubject,
	deleteSubject,
} from '../controllers/SubjectController.js';

const router = express.Router();

router
	.route('/')
	.get(getAllSubjects)
	.post(protect, allowedTo('admin'), createSubjectValidator, createSubject);

router
	.route('/:id')
	.get(getSubjectValidator, getSubject)
	.patch(protect, allowedTo('admin'), updateSubjectValidator, updateSubject)
	.delete(protect, allowedTo('admin'), deleteSubjectValidator, deleteSubject);

export default router;
