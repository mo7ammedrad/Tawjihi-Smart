import { check } from 'express-validator';
import { compareSync } from 'bcryptjs';
import User from '../../models/User.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createUserValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required')),
	check('email')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.email_required'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value });
			if (user) {
				throw new CustomError(req.__('validation.user_already_exists'), 400);
			}
			return true;
		}),

	check('password')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.password_required'))
		.isLength({ min: 8 })
		.withMessage((value, { req }) => req.__('validation.password_min_length'))
		.custom((value, { req }) => {
			if (req.body.confirmPassword !== value) {
				throw new CustomError(req.__('validation.password_mismatch'), 400);
			}
			return true;
		}),

	check('phone')
		.isMobilePhone(['ar-PS', 'he-IL'])
		.withMessage((value, { req }) => req.__('validation.invalid_phone_format'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ phone: value });
			if (user) {
				throw new CustomError(req.__('validation.phone_in_use'), 400);
			}
			return true;
		}),

	check('role')
		.optional()
		.isIn(['admin', 'teacher', 'user'])
		.withMessage((value, { req }) => req.__('validation.invalid_role')),

	validationMiddleware,
];

export const updateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	check('name')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required')),

	check('email')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.email_required'))
		.custom(async (value, { req }) => {
			if (value !== req.user.email) {
				const user = await User.findOne({ email: value });
				if (user) {
					throw new CustomError(req.__('validation.user_already_exists'), 400);
				}
			}
			return true;
		}),

	check('password')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.password_required'))
		.isLength({ min: 8 })
		.withMessage((value, { req }) => req.__('validation.password_min_length'))
		.custom((value, { req }) => {
			if (req.body.confirmPassword !== value) {
				throw new CustomError(req.__('validation.password_mismatch'), 400);
			}
			return true;
		}),

	check('phone')
		.optional()
		.isMobilePhone(['ar-PS', 'he-IL'])
		.withMessage((value, { req }) => req.__('validation.invalid_phone_format'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ phone: value });
			if (user) {
				if (user.id !== req.user.id) {
					throw new CustomError(req.__('validation.phone_in_use'), 400);
				}
				return true;
			}
		}),

	check('role')
		.optional()
		.isIn(['admin', 'teacher', 'user'])
		.withMessage((value, { req }) => req.__('validation.invalid_role')),

	validationMiddleware,
];

export const getUserValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	validationMiddleware,
];

export const deleteUserValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	validationMiddleware,
];

export const changePasswordValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	check('currentPassword')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.current_password_required'))
		.custom(async (value, { req }) => {
			const user = await User.findById(req.user.id).select('+password');

			if (!compareSync(value, user.password)) {
				throw new CustomError(req.__('validation.wrong_current_password'), 400);
			}
			return true;
		}),

	check('newPassword')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.new_password_required'))
		.isLength({ min: 8 })
		.withMessage((value, { req }) => req.__('validation.new_password_min_length'))
		.custom((value, { req }) => {
			if (req.body.newConfirmPassword !== value) {
				throw new CustomError(
					req.__('validation.new_password_does_not_match_confirm'),
					400,
				);
			}
			return true;
		}),

	validationMiddleware,
];

export const activateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	validationMiddleware,
];

export const deactivateUserValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format')),

	validationMiddleware,
];

export const acceptTeacherValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format'))
		.custom(async (value, { req }) => {
			const user = await User.findById(value);
			if (!user) {
				throw new CustomError(req.__('validation.no_teacher_found'), 404);
			}
			if (user.role !== 'teacher') {
				throw new CustomError(req.__('validation.this_user_is_not_a_teacher'), 400);
			}
			if (user.isActive === true) {
				throw new CustomError(req.__('validation.this_teacher_is_already_active'), 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const refuseTeacherValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id_format'))
		.custom(async (value, { req }) => {
			const user = await User.findById(value);
			if (!user) {
				throw new CustomError(req.__('validation.no_teacher_found'), 404);
			}
			if (user.role !== 'teacher') {
				throw new CustomError(req.__('validation.this_user_is_not_a_teacher'), 400);
			}
			return true;
		}),

	validationMiddleware,
];
