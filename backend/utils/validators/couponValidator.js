import { check } from 'express-validator';
import CustomError from '../CustomError.js';
import Coupon from '../../models/Coupon.js';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const createCouponValidator = [
	check('name')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.custom(async (value, { req }) => {
			const coupon = await Coupon.findOne({ name: value });
			if (coupon) {
				throw new CustomError(req.__('validation.coupon_already_exists'), 400);
			}
			return true;
		}),

	check('discount')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.discount_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.discount_must_be_number')),

	check('expire')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.expire_required'))
		.isDate()
		.withMessage((value, { req }) => req.__('validation.expire_must_be_date')),

	validationMiddleware,
];

export const updateCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.coupon_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_coupon_id')),

	check('name')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.name_required'))
		.custom(async (value, { req }) => {
			const coupon = await Coupon.findOne({ name: value });
			if (coupon) {
				throw new CustomError(req.__('validation.coupon_already_exists'), 400);
			}
			return true;
		}),

	check('discount')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.discount_required'))
		.isNumeric()
		.withMessage((value, { req }) => req.__('validation.discount_must_be_number')),

	check('expire')
		.optional()
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.expire_required'))
		.isDate()
		.withMessage((value, { req }) => req.__('validation.expire_must_be_date')),

	validationMiddleware,
];

export const getCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.coupon_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_coupon_id')),

	validationMiddleware,
];

export const deleteCouponValidator = [
	check('id')
		.notEmpty()
		.withMessage((value, { req }) => req.__('validation.coupon_id_required'))
		.isMongoId()
		.withMessage((value, { req }) => req.__('validation.invalid_coupon_id')),

	validationMiddleware,
];
