import Cart from '../models/Cart.js';
import Course from '../models/Course.js';
import Coupon from '../models/Coupon.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const sendRes = (res, cart) =>
	res.status(200).json({
		status: 'success',
		cart,
	});

export const getLoggedUserCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	if (!cart) cart = await Cart.create({ user: req.user.id });

	sendRes(res, cart);
});

export const addToCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	const course = await Course.findById(req.params.courseId);

	if (!cart) cart = await Cart.create({ user: req.user.id });
	else {
		const index = cart.courses.findIndex((item) => item.id === course.id);
		if (index === -1) {
			cart = await Cart.findOneAndUpdate(
				{ user: req.user.id },
				{
					$push: { courses: course.id },
					$inc: { totalPrice: course.price },
				},
				{ new: true },
			);
		}
	}

	sendRes(res, cart);
});

export const removeFromCart = asyncErrorHandler(async (req, res) => {
	let cart = await Cart.findOne({ user: req.user.id });
	const course = await Course.findById(req.params.courseId);

	if (!cart) cart = await Cart.create({ user: req.user.id });
	else {
		const index = cart.courses.findIndex((item) => item.id === course.id);
		if (index !== -1) {
			cart = await Cart.findOneAndUpdate(
				{ user: req.user.id },
				{
					$pull: { courses: course.id },
					$inc: { totalPrice: -course.price },
				},
				{ new: true },
			);
		}
	}

	sendRes(res, cart);
});

export const clearCart = asyncErrorHandler(async (req, res) => {
	const cart = await Cart.findOneAndUpdate(
		{ user: req.user.id },
		{
			courses: [],
			totalPrice: 0,
			totalPriceAfterDiscount: undefined,
		},
		{ new: true },
	);

	sendRes(res, cart);
});

export const applyCoupon = asyncErrorHandler(async (req, res) => {
	const cart = await Cart.findOne({ user: req.user.id });
	const coupon = await Coupon.findOne({ name: req.body.coupon });

	if (cart.courses.length !== 0) {
		const index = cart.appliedCoupons.findIndex((item) => item.toString() === coupon.id);
		if (index !== -1)
			throw new CustomError(
				req.__('cart.coupon_already_applied', { coupon_name: coupon.name }),
				400,
			);

		cart.totalPriceAfterDiscount = parseFloat(
			(cart.totalPrice - (coupon.discount / 100) * cart.totalPrice).toFixed(2),
		);
		cart.appliedCoupons.push(coupon.id);
		await cart.save();
	}

	sendRes(res, cart);
});
