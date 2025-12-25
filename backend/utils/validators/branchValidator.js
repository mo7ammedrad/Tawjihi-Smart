import { check } from 'express-validator';
import Branch from '../../models/Branch.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createBranchValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length'))
		.custom(async (value, { req }) => {
			const branch = await Branch.findOne({ name: value });
			if (branch) {
				throw new CustomError(req.__('validation.branch_already_exists'), 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	validationMiddleware,
];

export const updateBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.branch_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_branch_id')),

	check('name')
		.optional()
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length'))
		.custom(async (value, { req }) => {
			const branch = await Branch.findOne({ name: value, _id: { $ne: req.params.id } });
			if (branch) {
				throw new CustomError(req.__('validation.branch_already_exists'), 400);
			}
			return true;
		}),
	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	validationMiddleware,
];

export const getBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.branch_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_branch_id')),

	validationMiddleware,
];

export const deleteBranchValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.branch_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_branch_id')),

	validationMiddleware,
];
