import CustomError from '../utils/CustomError.js';
import i18n from '../config/i18n.js';

const devError = function (err, res) {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		stack: err.stack,
		error: err,
	});
};

const prodError = function (err, res) {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: 'error',
			message: i18n.__({ phrase: 'generic.something_went_wrong' }),
		});
	}
};

const castError = (err) => {
	const message = i18n.__({ phrase: 'generic.invalid_id' }, { path: err.path, value: err.value });
	return new CustomError(message, 400);
};

const validationError = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = i18n.__(
		{ phrase: 'generic.invalid_input_data' },
		{ errors: errors.join('. ') },
	);
	return new CustomError(message, 400);
};

const duplicateError = (err) => {
	const value = err.keyValue.name;
	const message = i18n.__({ phrase: 'generic.duplicate_field' }, { value });
	return new CustomError(message, 400);
};

const JsonWebTokenError = () =>
	new CustomError(i18n.__({ phrase: 'generic.invalid_token_login_again' }), 401);

const tokenExpiredError = () => new CustomError(i18n.__({ phrase: 'generic.token_expired' }), 401);

export const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	err.message = err.message || i18n.__({ phrase: 'generic.something_went_wrong' });

	if (process.env.NODE_ENV === 'development') {
		devError(err, res);
	}
	if (process.env.NODE_ENV === 'production') {
		let error = { ...err, message: err.message };
		if (error.name === 'CastError') error = castError(error);
		if (error.name === 'ValidationError') error = validationError(error);
		if (error.code === 11000) error = duplicateError(error);
		if (error.name === 'JsonWebTokenError') error = JsonWebTokenError();
		if (error.name === 'TokenExpiredError') error = tokenExpiredError();

		prodError(error, res);
	}
};

export const asyncErrorHandler = function (fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((err) => next(err));
	};
};
