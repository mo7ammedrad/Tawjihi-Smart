import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { sendEmail } from '../utils/emails.js';
import CustomError from '../utils/CustomError.js';
import { createToken } from '../utils/JWTs.js';
import { resetPasswordTemp } from '../utils/emailTemps.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const sendAuthRes = async function (res, user, statusCode) {
	const token = createToken(user.id);
	const isDev = process.env.NODE_ENV !== 'production';
	const options = {
		httpOnly: true,
		sameSite: isDev ? 'Lax' : 'None',
		secure: !isDev,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	};

	let cart = await Cart.findOne({ user: user.id });
	if (!cart) {
		cart = await Cart.create({ user: user.id });
	}

	const userToRes = { ...user._doc, ...{ cart: cart.courses } };
	delete userToRes.password;

	res.cookie('token', token, options);

	res.status(statusCode).json({
		status: 'success',
		token,
		user: userToRes,
	});
};

export const signup = asyncErrorHandler(async (req, res, next) => {
	if (req.body.role === 'teacher') req.body.isActive = false;

	const user = await User.create(req.body);

	if (user.role === 'teacher') {
		return res.status(201).json({
			status: 'success',
			message: req.__('auth.teacher_signup_success'),
		});
	}
	sendAuthRes(res, user, 201);
});

export const login = asyncErrorHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email }).select('+password');

	if (user && !user.password && (user.googleId || user.facebookId))
		throw new CustomError(req.__('auth.social_login_required'), 403);

	if (!user.isActive || !bcryptjs.compareSync(req.body.password, user.password))
		throw new CustomError(req.__('auth.wrong_email_or_password'), 400);

	sendAuthRes(res, user, 200);
});

export const forgetPassword = asyncErrorHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	const locale = req.getLocale();

	const resetCode = crypto.randomInt(100000, 999999);

	user.resetPasswordCode = crypto.createHash('sha256').update(resetCode.toString()).digest('hex');
	user.resetPasswordCodeExpired = Date.now() + 15 * 60 * 1000;
	user.resetPasswordCodeVerified = false;
	await user.save();

	const options = {
		from: 'Tawjihi Support',
		to: user.email,
		subject: req.__('emails.reset_password.subject'),
		html: resetPasswordTemp(user.name, resetCode, locale),
	};

	try {
		await sendEmail(options);
	} catch (error) {
		user.resetPasswordCode = undefined;
		user.resetPasswordCodeExpired = undefined;
		user.resetPasswordCodeVerified = undefined;
		await user.save();
		throw new CustomError(req.__('auth.sending_email_failed'), 500);
	}

	res.status(200).json({
		status: 'success',
		message: req.__('auth.reset_password_email_sent'),
	});
});

export const verifyResetCod = asyncErrorHandler(async (req, res) => {
	const hashedResetCode = crypto
		.createHash('sha256')
		.update(req.body.resetCode.toString())
		.digest('hex');

	const user = await User.findOne({
		resetPasswordCode: hashedResetCode,
		resetPasswordCodeExpired: { $gte: Date.now() },
	});

	if (!user) throw new CustomError(req.__('auth.user_not_found'), 404);

	user.resetPasswordCodeVerified = true;
	await user.save();

	res.status(200).json({
		status: 'success',
		message: req.__('auth.can_reset_password'),
	});
});

export const resetPassword = asyncErrorHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user.resetPasswordCodeVerified)
		throw new CustomError(req.__('auth.not_verified_reset_code'), 403);

	user.password = req.body.newPassword;
	user.resetPasswordCode = undefined;
	user.resetPasswordCodeExpired = undefined;
	user.resetPasswordCodeVerified = undefined;
	user.PasswordChangedAt = Date.now();
	await user.save();

	sendAuthRes(res, user, 201);
});

export const logout = (req, res) => {
	const isDev = process.env.NODE_ENV !== 'production';
	const options = {
		httpOnly: true,
		sameSite: isDev ? 'Lax' : 'None',
		secure: !isDev,
	};
	res.clearCookie('token', options);
	res.status(200).json({
		status: 'success',
		message: req.__('auth.logged_out'),
	});
};

export const getToken = (req, res) => {
	const token = createToken(req.user.id);
	res.status(200).json({
		status: 'success',
		token,
	});
};
