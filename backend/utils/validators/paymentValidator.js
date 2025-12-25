import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Course from '../../models/Course.js';
import Enrollment from '../../models/Enrollment.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCheckoutSessionValidator = [
	check('ids')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.courses_required'))
		.isArray()
		.custom(async (ids, { req }) => {
			const coursesPromises = ids.map((id) => Course.findById(id));
			const courses = await Promise.all(coursesPromises);
			if (courses.includes(null))
				throw new CustomError(req.__('validation.cannot_pay_for_nonexistent_course'), 400);

			const enrollmentsPromises = courses.map((course) =>
				Enrollment.findOne({ course, user: req.user.id }),
			);
			const enrollments = await Promise.all(enrollmentsPromises);

			if (enrollments.findIndex((enrolment) => enrolment !== null) !== -1)
				throw new CustomError(req.__('validation.cannot_enroll_multiple_times'), 400);

			return true;
		}),
	validationMiddleware,
];
