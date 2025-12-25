import Review from '../models/Review.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

export const getAllReviews = getAll(Review);

export const createReview = createOne(Review);

export const getReview = getOne(Review, 'Review');

export const updateReview = updateOne(Review, 'Review');

export const deleteReview = deleteOne(Review, 'Review');
