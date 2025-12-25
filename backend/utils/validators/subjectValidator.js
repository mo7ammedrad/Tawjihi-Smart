import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Subject from '../../models/Subject.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createSubjectValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length'))
		.custom(async (value, { req }) => {
			const subject = await Subject.findOne({ name: value });
			if (subject) {
				throw new CustomError(req.__('validation.subject_already_exists'), 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	validationMiddleware,
];

export const updateSubjectValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.subject_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_subject_id_format')),

	check('name')
		.optional()
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length'))
		.custom(async (value, { req }) => {
			const subject = await Subject.findOne({ name: value, _id: { $ne: req.params.id } });
			if (subject) {
				throw new CustomError(req.__('validation.subject_already_exists'), 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	validationMiddleware,
];

export const getSubjectValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.subject_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_subject_id_format')),

	validationMiddleware,
];

export const deleteSubjectValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.subject_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_subject_id_format')),

	validationMiddleware,
];
