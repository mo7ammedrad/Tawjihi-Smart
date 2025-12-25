import TeacherReview from '../models/TeacherReview.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const addTeacherIdToReqBody = (req, res, next) => {
	if (req.params.teacherId) {
		req.body.teacher = req.params.teacherId;
	}
	next();
};

export const addTeacherIdToReqQuery = (req, res, next) => {
	if (req.params.teacherId) {
		req.query.teacher = req.params.teacherId;
	}
	next();
};

export const addUserIdToReqBody = (req, res, next) => {
	req.body.user = req.user.id;
	next();
};

export const deleteTeacherReviewMiddleware = asyncErrorHandler(async (req, res, next) => {
	const tReview = await TeacherReview.findById(req.params.id);
	if (!tReview) {
		throw new CustomError(req.__('reviews.no_review_found'), 404);
	}
	if (req.user.role === 'user') {
		if (tReview.user.id !== req.user.id) {
			throw new CustomError(req.__('reviews.not_authorized_to_delete'), 403);
		}
	}
	next();
});
