import express from 'express';

import { protect, allowedTo } from '../middlewares/authMiddleware.js';

import { wishlistValidator } from '../utils/validators/wishlistValidator.js';

import {
	getUserWishlist,
	addToWishlist,
	removeFromWishlist,
} from '../controllers/WishlistController.js';

const router = express.Router();

router.use(protect, allowedTo('user'));

router.get('/', getUserWishlist);

router
	.route('/:courseId')
	.post(wishlistValidator, addToWishlist)
	.delete(wishlistValidator, removeFromWishlist);

export default router;
