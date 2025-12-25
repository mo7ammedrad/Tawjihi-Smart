import { check } from 'express-validator';
import User from '../../models/User.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const signupValidator = [
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
		.withMessage((value, { req }) => req.__('validation.invalid_role'))
		.custom((value, { req }) => {
			if (value === 'admin')
				throw new CustomError(req.__('validation.cannot_signup_as_admin'), 400);
			return true;
		}),

	validationMiddleware,
];

export const loginValidator = [
	check('email')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.email_required'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value });
			if (!user) {
				throw new CustomError(req.__('auth.wrong_email_or_password'), 400);
			}
			return true;
		}),

	check('password')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.password_required'))
		.isLength({ min: 8 })
		.withMessage((value, { req }) => req.__('validation.password_min_length')),

	validationMiddleware,
];

export const forgetPasswordValidator = [
	check('email')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.email_required'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value });
			if (!user) {
				throw new CustomError(req.__('validation.no_user_with_email'), 404);
			}
			return true;
		}),

	validationMiddleware,
];

export const verifyResetCodValidator = [
	check('resetCode')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.reset_code_required'))
		.custom((value, { req }) => {
			if (value < 100000 || value > 999999) {
				throw new CustomError(req.__('validation.invalid_reset_code'), 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const resetPasswordValidator = [
	check('email')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.email_required'))
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value });
			if (!user) {
				throw new CustomError(req.__('auth.user_not_found'), 404);
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
				throw new CustomError(req.__('validation.new_password_mismatch'), 400);
			}
			return true;
		}),

	validationMiddleware,
];
