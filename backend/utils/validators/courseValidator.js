import { check } from 'express-validator';
import User from '../../models/User.js';
import Subject from '../../models/Subject.js';
import Branch from '../../models/Branch.js';
import Course from '../../models/Course.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCourseValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length')),

	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	check('teacher')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_teacher'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_teacher_id'))
		.custom(async (value, { req }) => {
			const teacher = await User.findById(value);
			if (!teacher) throw new CustomError(req.__('validation.teacher_not_found'), 404);
			if (teacher.id !== value)
				throw new CustomError(
					req.__('validation.cannot_create_course_for_another_teacher'),
					403,
				);
			return true;
		}),

	check('subject')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_subject'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_subject_id'))
		.custom(async (value, { req }) => {
			const subject = await Subject.findById(value);
			if (!subject) throw new CustomError(req.__('validation.subject_not_found'), 404);

			return true;
		}),

	check('branches')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_branch'))
		.isArray()
		.withMessage((value, { req }) => req.__('validation.branches_must_be_array'))
		.custom(async (branchIds, { req }) => {
			if (!Array.isArray(branchIds) || branchIds.length === 0)
				throw new CustomError(req.__('validation.course_must_have_branch'), 404);

			const promises = branchIds.map((id) => Branch.findById(id));
			const branches = await Promise.all(promises);
			const result = branches.every((item) => item !== null);

			if (!result) throw new CustomError(req.__('validation.branch_not_found'), 404);
			return true;
		}),

	check('price')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.price_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.price_must_be_number')),

	check('priceAfterDiscount')
		.optional()
		.custom((value, { req }) => {
			if (req.body.price) {
				if (value > req.body.price)
					throw new CustomError(req.__('validation.price_after_discount_invalid'), 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const updateCourseValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id'))
		.custom(async (courseId, { req }) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
			return true;
		}),

	check('name')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.isLength({ min: 3 })
		.withMessage((value, { req }) => req.__('validation.name_min_length')),

	check('description')
		.optional()
		.isLength({ min: 10, max: 1000 })
		.withMessage((value, { req }) => req.__('validation.description_length')),

	check('teacher')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_teacher'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_teacher_id'))
		.custom(async (value, { req }) => {
			const teacher = await User.findById(value);
			if (!teacher) throw new CustomError(req.__('validation.teacher_not_found'), 404);
			return true;
		}),

	check('subject')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_subject'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_subject_id'))
		.custom(async (value, { req }) => {
			const subject = await Subject.findById(value);
			if (!subject) throw new CustomError(req.__('validation.subject_not_found'), 404);

			return true;
		}),

	check('branches')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_must_have_branch'))
		.isArray()
		.withMessage((value, { req }) => req.__('validation.branches_must_be_array'))
		.custom(async (branchIds, { req }) => {
			if (!Array.isArray(branchIds) || branchIds.length === 0)
				throw new CustomError(req.__('validation.course_must_have_branch'), 404);

			const promises = branchIds.map((id) => Branch.findById(id));
			const branches = await Promise.all(promises);
			const result = branches.every((item) => item !== null);

			if (!result) throw new CustomError(req.__('validation.branch_not_found'), 404);
			return true;
		}),

	check('price')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.price_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.price_must_be_number')),

	check('priceAfterDiscount')
		.optional()
		.custom((value, { req }) => {
			if (req.body.price) {
				if (value > req.body.price)
					throw new CustomError(req.__('validation.price_after_discount_invalid'), 400);
			}
			return true;
		}),

	validationMiddleware,
];

export const getCourseValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id')),

	validationMiddleware,
];

export const deleteCourseValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id'))
		.custom(async (courseId, { req }) => {
			const course = await Course.findById(courseId);
			if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
			return true;
		}),

	validationMiddleware,
];
