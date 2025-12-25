import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Lesson from '../../models/Lesson.js';
import Comment from '../../models/Comment.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCommentValidator = [
	check('lesson')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id'))
		.custom(async (value, { req }) => {
			const lesson = await Lesson.findById(value);
			if (!lesson) {
				throw new CustomError(req.__('validation.no_lesson_found'), 404);
			}
			const enrollment = await Enrollment.findOne({
				course: lesson.course,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					req.__('validation.cannot_comment_on_unenrolled_course'),
					403,
				);
			}
			return true;
		}),

	check('user')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	check('content')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.comment_required')),

	validationMiddleware,
];

export const getCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.comment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_comment_id'))
		.custom(async (value, { req }) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError(req.__('validation.no_comment_found'), 404);
			}
		}),

	validationMiddleware,
];

export const updateCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.comment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_comment_id'))
		.custom(async (value, { req }) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError(req.__('validation.no_comment_found'), 404);
			}
		}),

	check('lesson')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id'))
		.custom(async (value, { req }) => {
			const lesson = await Lesson.findById(value);
			if (!lesson) {
				throw new CustomError(req.__('validation.no_lesson_found'), 404);
			}
			const enrollment = await Enrollment.findOne({
				course: lesson.course,
				user: req.user.id,
			});
			if (!enrollment) {
				throw new CustomError(
					req.__('validation.cannot_comment_on_unenrolled_course'),
					403,
				);
			}
			return true;
		}),

	check('user')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.user_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_user_id')),

	check('content')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.comment_required')),

	validationMiddleware,
];

export const deleteCommentValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.comment_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_comment_id'))
		.custom(async (value, { req }) => {
			const comment = await Comment.findById(value);
			if (!comment) {
				throw new CustomError(req.__('validation.no_comment_found'), 404);
			}
		}),

	validationMiddleware,
];
