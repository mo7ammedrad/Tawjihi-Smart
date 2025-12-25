import { check } from 'express-validator';
import Course from '../../models/Course.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const wishlistValidator = [
	check('courseId')
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
