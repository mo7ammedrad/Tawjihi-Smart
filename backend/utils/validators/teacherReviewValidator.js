import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import User from '../../models/User.js';
import TeacherReview from '../../models/TeacherReview.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createTeacherReviewValidator = [
	check('teacher')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.teacher_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_teacher_id'))
		.custom(async (value, { req }) => {
			const teacher = await User.findOne({
				_id: value,
				isActive: true,
				role: 'teacher',
			});
			if (!teacher) {
				throw new CustomError(req.__('validation.no_teacher_found'), 404);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const tReview = await TeacherReview.findOne({
				teacher: value,
				user: req.user.id,
			});
			if (tReview) {
				throw new CustomError(req.__('validation.already_reviewed_teacher'), 400);
			}
			return true;
		}),

	check('user')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	check('comment')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_comment_required'))
		.isLength({ max: 500 })
		.withMessage((value, { req }) => req.__('validation.review_comment_max_length')),

	check('rating')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_rating_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.review_rating_must_be_number'))
		.isFloat({ min: 1, max: 5 })
		.withMessage((value, { req }) => req.__('validation.review_rating_range')),

	validationMiddleware,
];

export const getTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

	validationMiddleware,
];

export const updateTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

	check('teacher')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.teacher_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_teacher_id'))
		.custom(async (value, { req }) => {
			const teacher = await User.findOne({
				_id: value,
				isActive: true,
				role: 'teacher',
			});
			if (!teacher) {
				throw new CustomError(req.__('validation.no_teacher_found'), 404);
			}
			return true;
		}),

	check('user')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	check('comment')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_comment_required'))
		.isLength({ max: 500 })
		.withMessage((value, { req }) => req.__('validation.review_comment_max_length')),

	check('rating')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_rating_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.review_rating_must_be_number'))
		.isFloat({ min: 1, max: 5 })
		.withMessage((value, { req }) => req.__('validation.review_rating_range')),

	validationMiddleware,
];

export const deleteTeacherReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const tReview = await TeacherReview.findById(value);
			if (!tReview) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

	validationMiddleware,
];
