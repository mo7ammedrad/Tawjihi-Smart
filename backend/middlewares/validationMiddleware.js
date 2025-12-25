import { validationResult } from 'express-validator';
import CustomError from '../utils/CustomError.js';
import removeLocalFiles from '../utils/removeLocalFiles.js';
import uploadToCloud from '../utils/uploadToCloud.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const validationMiddleware = asyncErrorHandler(async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		removeLocalFiles(req);
		const message = errors
			.array()
			.map((el) => el.msg)
			.join(' | ');
		return next(new CustomError(message, 400));
	}
	await uploadToCloud(req);
	next();
});
