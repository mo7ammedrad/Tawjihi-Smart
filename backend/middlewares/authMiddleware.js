import User from '../models/User.js';
import CustomError from '../utils/CustomError.js';
import { verifyToken } from '../utils/JWTs.js';
import { asyncErrorHandler } from './errorMiddleware.js';

export const protect = asyncErrorHandler(async (req, res, next) => {
	let token;
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (authHeader) token = authHeader.split(' ')[1];
	if (req.cookies.token) ({ token } = req.cookies);

	if (!token) throw new CustomError(req.__('auth.not_logged_in'), 401);

	const decoded = await verifyToken(token);
	if (!decoded) throw new CustomError(req.__('auth.invalid_token'), 401);

	const user = await User.findById(decoded.id);
	if (!user || !user.isActive) throw new CustomError(req.__('auth.token_user_not_found'), 401);

	if (user.PasswordChangedAt) {
		if (user.PasswordChangedAt.getTime() > decoded.iat * 1000)
			throw new CustomError(req.__('auth.password_recently_changed'), 401);
	}

	req.user = user;
	next();
});

export const allowedTo = (...roles) =>
	// eslint-disable-next-line require-await
	asyncErrorHandler(async (req, res, next) => {
		if (!roles.includes(req.user.role))
			throw new CustomError(req.__('auth.action_not_allowed'), 403);

		next();
	});
