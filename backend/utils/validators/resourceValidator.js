import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Lesson from '../../models/Lesson.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const getAllResourceValidator = [
	check('lessonId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (lessonId, { req }) => {
			const lesson = await Lesson.findById(lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);
			return true;
		}),

	validationMiddleware,
];

export const createResourceValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.name_must_be_string'))
		.trim()
		.escape(),

	check('content')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.content_required')),

	check('lessonId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (lessonId, { req }) => {
			const lesson = await Lesson.findById(lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);
			return true;
		}),

	validationMiddleware,
];

export const getResourceValidator = [
	check('lessonId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (lessonId, { req }) => {
			const lesson = await Lesson.findById(lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);
			return true;
		}),

	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.resource_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_resource_id'))
		.custom(async (id, { req }) => {
			const lesson = await Lesson.findById(req.params.lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);

			const resource = lesson.resources.find((resource) => resource._id.toString() === id);
			if (!resource) throw new CustomError(req.__('validation.no_resource_found'), 404);

			return true;
		}),
	validationMiddleware,
];

export const updateResourceValidator = [
	check('name')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isString()
		.withMessage((value, { req }) => req.__('validation.name_must_be_string'))
		.trim()
		.escape(),

	check('content')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.content_required')),

	check('lessonId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (lessonId, { req }) => {
			const lesson = await Lesson.findById(lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);
			return true;
		}),

	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.resource_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_resource_id'))
		.custom(async (id, { req }) => {
			const lesson = await Lesson.findById(req.params.lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);

			const resource = lesson.resources.find((resource) => resource._id.toString() === id);
			if (!resource) throw new CustomError(req.__('validation.no_resource_found'), 404);

			return true;
		}),
	validationMiddleware,
];

export const deleteResourceValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.resource_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_resource_id')),

	check('lessonId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.lesson_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_lesson_id_format'))
		.custom(async (lessonId, { req }) => {
			const lesson = await Lesson.findById(lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);
			return true;
		}),

	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.resource_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_resource_id'))
		.custom(async (id, { req }) => {
			const lesson = await Lesson.findById(req.params.lessonId);
			if (!lesson) throw new CustomError(req.__('validation.no_lesson_found'), 404);

			const resource = lesson.resources.find((resource) => resource._id.toString() === id);
			if (!resource) throw new CustomError(req.__('validation.no_resource_found'), 404);

			return true;
		}),

	validationMiddleware,
];
