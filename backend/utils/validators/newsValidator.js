import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createNewValidator = [
	check('title')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.title_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.title_min_length')),

	check('body')
		.isLength({ min: 10, max: 10000 })
		.withMessage((value, { req }) => req.__('validation.body_length')),

	validationMiddleware,
];

export const updateNewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.new_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_new_id')),

	check('title')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.title_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.title_min_length')),

	check('body')
		.optional()
		.isLength({ min: 10, max: 10000 })
		.withMessage((value, { req }) => req.__('validation.body_length')),

	validationMiddleware,
];

export const getNewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.new_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_new_id')),

	validationMiddleware,
];

export const deleteNewValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.new_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_new_id')),

	validationMiddleware,
];
