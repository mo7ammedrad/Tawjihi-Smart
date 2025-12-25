import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	addUserIdToReqParams,
	updateMeMiddleware,
	activationMiddleware,
} from '../middlewares/userMiddleware.js';

import {
	getUserValidator,
	createUserValidator,
	updateUserValidator,
	deleteUserValidator,
	changePasswordValidator,
	activateUserValidator,
	deactivateUserValidator,
	acceptTeacherValidator,
	refuseTeacherValidator,
} from '../utils/validators/userValidator.js';

import {
	getAllUsers,
	createUser,
	getUser,
	updateUser,
	deleteUser,
	uploadUserFiles,
	handleUserFiles,
	deleteMe,
	getMe,
	changePassword,
	acceptTeacher,
	refuseTeacher,
} from '../controllers/UserController.js';

import teacherReviewRoutes from './TeacherReviewRoutes.js';

const router = express.Router();

router.use('/:teacherId/teacherReviews', teacherReviewRoutes);

router
	.route('/deleteMe')
	.delete(protect, allowedTo('user', 'teacher'), addUserIdToReqParams, deleteMe);

router
	.route('/updateMe')
	.patch(
		protect,
		allowedTo('admin', 'user', 'teacher'),
		uploadUserFiles,
		handleUserFiles,
		addUserIdToReqParams,
		updateMeMiddleware,
		updateUserValidator,
		updateUser,
	);

router
	.route('/changePassword')
	.patch(
		protect,
		allowedTo('admin', 'user', 'teacher'),
		addUserIdToReqParams,
		changePasswordValidator,
		changePassword,
	);

router
	.route('/me')
	.get(
		protect,
		allowedTo('admin', 'user', 'teacher'),
		addUserIdToReqParams,
		getUserValidator,
		getMe,
	);

router
	.route('/')
	.get(getAllUsers)
	.post(
		protect,
		allowedTo('admin'),
		uploadUserFiles,
		handleUserFiles,
		createUserValidator,
		createUser,
	);

router
	.route('/:id/activate')
	.patch(
		protect,
		allowedTo('admin'),
		activateUserValidator,
		activationMiddleware(true),
		updateUser,
	);

router
	.route('/:id/deactivate')
	.patch(
		protect,
		allowedTo('admin'),
		deactivateUserValidator,
		activationMiddleware(false),
		updateUser,
	);

router
	.route('/:id/acceptTeacher')
	.patch(
		protect,
		allowedTo('admin'),
		acceptTeacherValidator,
		activationMiddleware(true),
		acceptTeacher,
	);

router
	.route('/:id/refuseTeacher')
	.delete(protect, allowedTo('admin'), refuseTeacherValidator, refuseTeacher);

router
	.route('/:id')
	.get(getUserValidator, getUser)
	.patch(
		protect,
		allowedTo('admin'),
		uploadUserFiles,
		handleUserFiles,
		updateUserValidator,
		updateUser,
	)
	.delete(protect, allowedTo('admin'), deleteUserValidator, deleteUser);

export default router;
