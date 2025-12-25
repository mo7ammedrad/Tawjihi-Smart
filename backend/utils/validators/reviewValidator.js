import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Review from '../../models/Review.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createReviewValidator = [
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
			if (!enrollment) {
				throw new CustomError(req.__('validation.cannot_review_unenrolled_course'), 403);
			}
			return true;
		})
		.custom(async (value, { req }) => {
			const review = await Review.findOne({
				course: value,
				user: req.user.id,
			});
			if (review) {
				throw new CustomError(req.__('validation.already_reviewed_course'), 400);
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
		.isFloat({ min: 0, max: 5 })
		.withMessage((value, { req }) => req.__('validation.review_rating_range')),

	validationMiddleware,
];

export const getReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

	validationMiddleware,
];

export const updateReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

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
			if (!enrollment) {
				throw new CustomError(req.__('validation.cannot_review_unenrolled_course'), 403);
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
		.isFloat({ min: 0, max: 5 })
		.withMessage((value, { req }) => req.__('validation.review_rating_range')),

	validationMiddleware,
];

export const deleteReviewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.review_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_review_id'))
		.custom(async (value, { req }) => {
			const review = await Review.findById(value);
			if (!review) {
				throw new CustomError(req.__('reviews.no_review_found'), 404);
			}
		}),

	validationMiddleware,
];
