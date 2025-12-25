import express from 'express';
import { protect, allowedTo } from '../middlewares/authMiddleware.js';
import {
	addUserToReqBody,
	deleteEnrollmentMiddleware,
} from '../middlewares/enrollmentMiddleware.js';

import {
	createEnrollmentValidator,
	getEnrollmentValidator,
	updateEnrollmentValidator,
	deleteEnrollmentValidator,
} from '../utils/validators/enrollmentValidator.js';

import {
	getAllEnrollments,
	createEnrollment,
	getEnrollment,
	updateEnrollment,
	deleteEnrollment,
} from '../controllers/EnrollmentController.js';

const router = express.Router();

router
	.route('/')
	.get(getAllEnrollments)
	.post(
		protect,
		allowedTo('user'),
		addUserToReqBody,
		createEnrollmentValidator,
		createEnrollment,
	);

router
	.route('/:id')
	.get(getEnrollmentValidator, getEnrollment)
	.patch(protect, allowedTo('admin'), updateEnrollmentValidator, updateEnrollment)
	.delete(protect, deleteEnrollmentMiddleware, deleteEnrollmentValidator, deleteEnrollment);

export default router;
