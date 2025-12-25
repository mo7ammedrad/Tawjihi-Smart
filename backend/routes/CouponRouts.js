import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import {
	createCouponValidator,
	updateCouponValidator,
	getCouponValidator,
	deleteCouponValidator,
} from '../utils/validators/couponValidator.js';

import {
	getAllCoupons,
	createCoupon,
	getCoupon,
	updateCoupon,
	deleteCoupon,
} from '../controllers/CouponController.js';

const router = express.Router();

router.use(protect, allowedTo('admin'));

router.route('/').get(getAllCoupons).post(createCouponValidator, createCoupon);

router
	.route('/:id')
	.get(getCouponValidator, getCoupon)
	.patch(updateCouponValidator, updateCoupon)
	.delete(deleteCouponValidator, deleteCoupon);

export default router;
