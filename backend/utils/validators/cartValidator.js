import { check } from 'express-validator';
import Course from '../../models/Course.js';
import Coupon from '../../models/Coupon.js';
import Enrollment from '../../models/Enrollment.js';
import CustomError from '../CustomError.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const cartValidator = [
	check('courseId')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.course_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_course_id'))
		.custom(async (value, { req }) => {
			const course = await Course.findById(value);
			if (!course) throw new CustomError(req.__('validation.no_course_found'), 404);
			const enrollment = await Enrollment.findOne({
				course: value,
				user: req.user.id,
			});
			if (enrollment) throw new CustomError(req.__('validation.already_enrolled'), 400);
			return true;
		}),

	validationMiddleware,
];

export const applyCouponValidator = [
	check('coupon')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.coupon_required'))
		.custom(async (value, { req }) => {
			const coupon = await Coupon.findOne({
				name: value,
				expire: { $gte: Date.now() },
			});
			if (!coupon) throw new CustomError(req.__('validation.invalid_or_expired_coupon'), 404);
			return true;
		}),

	validationMiddleware,
];
