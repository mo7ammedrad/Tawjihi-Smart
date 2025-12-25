import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const addUserToReqBody = (req, res, next) => {
	req.body.user = req.user.id;
	next();
};

export const deleteEnrollmentMiddleware = asyncErrorHandler(async (req, res, next) => {
	const enrollment = await Enrollment.findById(req.params.id);
	const user = await User.findById(req.user.id);

	if (!enrollment) throw new CustomError(req.__('enrollments.no_enrollment_found'), 404);

	if (user.role === 'user') {
		if (user.id !== enrollment.user.id)
			throw new CustomError(req.__('enrollments.cannot_delete_enrollment'), 403);
	}
	if (user.role === 'teacher') {
		if (user.id !== enrollment.course.teacher.id)
			throw new CustomError(req.__('enrollments.cannot_delete_enrollment'), 403);
	}
	next();
});
