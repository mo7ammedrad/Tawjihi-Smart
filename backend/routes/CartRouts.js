import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import { cartValidator, applyCouponValidator } from '../utils/validators/cartValidator.js';

import {
	getLoggedUserCart,
	addToCart,
	removeFromCart,
	clearCart,
	applyCoupon,
} from '../controllers/CartController.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.post('/applyCoupon', applyCouponValidator, applyCoupon);

router.route('/').get(getLoggedUserCart).delete(clearCart);

router.route('/:courseId').post(cartValidator, addToCart).delete(cartValidator, removeFromCart);

export default router;
