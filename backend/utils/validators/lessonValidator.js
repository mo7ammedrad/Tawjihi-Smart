import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createLessonValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.name_must_be_string'))
		.trim()
		.escape(),

	check('description')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.description_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.description_must_be_string'))
		.trim()
		.escape(),

	check('video')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.video_required')),

	check('course')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (courseId, { req }) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
			return true;
		}),

	validationMiddleware,
];

export const getLessonValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format')),

	validationMiddleware,
];

export const updateLessonValidator = [
	check('name')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.name_must_be_string'))
		.trim()
		.escape(),

	check('description')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.description_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.description_must_be_string'))
		.trim()
		.escape(),

	check('video')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.video_required')),

	check('course')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (courseId, { req }) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
			return true;
		}),

	validationMiddleware,
];

export const deleteLessonValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format')),

	validationMiddleware,
];
