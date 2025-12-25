import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const checkCourseBelongToTeacher = asyncErrorHandler(async (req, res, next) => {
	if (req.user.role === 'teacher') {
		const course = await Course.findById(req.params.id);
		if (req.user.id !== course.teacher.id)
			throw new CustomError(req.__('courses.course_does_not_belong_to_you'), 403);
	}
	next();
});

export const normalizeCourseFields = (req, res, next) => {
	// Ensure branches is an array (multer with single file can flatten it)
	if (typeof req.body.branches === 'string') {
		try {
			const parsed = JSON.parse(req.body.branches);
			req.body.branches = Array.isArray(parsed) ? parsed : [req.body.branches];
		} catch (err) {
			req.body.branches = [req.body.branches];
		}
	}

	// Coerce numeric fields
	if (typeof req.body.price === 'string') req.body.price = Number(req.body.price);
	if (typeof req.body.priceAfterDiscount === 'string') {
		const val = req.body.priceAfterDiscount.trim();
		if (val === '') delete req.body.priceAfterDiscount;
		else req.body.priceAfterDiscount = Number(val);
	}

	// If the caller is a teacher, force teacher id from token
	if (req.user?.role === 'teacher') {
		req.body.teacher = req.user.id;
	}

	next();
};
