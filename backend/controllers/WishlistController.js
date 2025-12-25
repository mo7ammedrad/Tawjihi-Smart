import User from '../models/User.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const getUserWishlist = (req, res) =>
	res.status(200).json({
		status: 'success',
		wishlist: req.user.wishlist,
	});

export const addToWishlist = asyncErrorHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$addToSet: { wishlist: req.params.courseId },
		},
		{
			runValidators: true,
			new: true,
		},
	);

	res.status(200).json({
		status: 'success',
		wishlist: user.wishlist,
	});
});

export const removeFromWishlist = asyncErrorHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user.id,
		{
			$pull: { wishlist: req.params.courseId },
		},
		{
			runValidators: true,
			new: true,
		},
	);

	res.status(200).json({
		status: 'success',
		wishlist: user.wishlist,
	});
});
