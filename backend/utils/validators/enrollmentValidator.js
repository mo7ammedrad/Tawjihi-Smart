import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createEnrollmentValidator = [
	check('course')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id'))
		.custom(async (value, { req }) => {
			const course = await Course.findById(value);
			if (!course) {
				throw new CustomError(req.__('validation.no_course_found'), 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (enrollment) {
				throw new CustomError(req.__('validation.already_enrolled_in_course'), 400);
			}
			return true;
		}),

	check('user')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	validationMiddleware,
];

export const getEnrollmentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.enrollment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_enrollment_id')),

	validationMiddleware,
];

export const updateEnrollmentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.enrollment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_enrollment_id')),

	check('course')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id'))
		.custom(async (value, { req }) => {
			const course = await Course.findById(value);
			if (!course) {
				throw new CustomError(req.__('validation.no_course_found'), 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (enrollment) {
				throw new CustomError(req.__('validation.already_enrolled_in_course'), 400);
			}
			return true;
		}),

	check('user')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	validationMiddleware,
];

export const deleteEnrollmentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.enrollment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_enrollment_id')),

	validationMiddleware,
];
