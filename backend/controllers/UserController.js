import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { sendEmail } from '../utils/emails.js';
import CustomError from '../utils/CustomError.js';
import { sendAuthRes } from './AuthController.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadMultipleFields } from '../middlewares/uploadsMiddleware.js';
import { acceptTeacherTemp, refuseTeacherTemp } from '../utils/emailTemps.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllUsers = getAll(User);

export const createUser = createOne(User);

export const getUser = getOne(User, 'User');

export const updateUser = updateOne(User, 'User');

export const deleteUser = deleteOne(User, 'User');

export const uploadUserFiles = uploadMultipleFields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'cv', maxCount: 1 },
]);

export const handleUserFiles = asyncErrorHandler(async (req, res, next) => {
	if (req.files) {
		if (req.files.coverImage) {
			const { mimetype } = req.files.coverImage[0];
			if (!mimetype.startsWith('image'))
				throw new CustomError(req.__('generic.invalid_file_type_for_cover_image'), 400);

			const unique = crypto.randomUUID();
			const name = `user-${unique}-${Date.now()}.jpeg`;
			const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'users');
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}
			const filePath = path.join(uploadDir, name);
			const buffer = await sharp(req.files.coverImage[0].buffer)
				.resize(500, 500)
				.toFormat('jpeg')
				.jpeg({ quality: 90 })
				.toBuffer();

			fs.writeFileSync(filePath, buffer);

			req.coverImageFilePath = filePath;
			req.upload = 'user';
		}
		if (req.files.cv) {
			const { mimetype } = req.files.cv[0];
			if (!mimetype.endsWith('pdf'))
				throw new CustomError(req.__('users.invalid_file_type_for_cv'), 400);

			const unique = crypto.randomUUID();
			const name = `cv-${unique}-${Date.now()}.pdf`;
			const uploadDir = path.join(__dirname, '..', 'uploads', 'cvs');
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}
			const filePath = path.join(uploadDir, name);
			fs.writeFileSync(filePath, req.files.cv[0].buffer);

			req.cvFilePath = filePath;
			req.upload = 'user';
		}
	}
	next();
});

export const deleteMe = asyncErrorHandler(async (req, res) => {
	await User.findByIdAndUpdate(req.user.id, { isActive: false });
	res.status(204).send();
});

export const getMe = asyncErrorHandler(async (req, res) => {
	const user = await User.findById(req.user.id).select('-password -PasswordChangedAt');
	const cart = await Cart.findOne({ user: user.id });
	const userToRes = { ...user._doc, ...{ cart: cart.courses } };

	res.status(200).json({
		status: 'success',
		user: userToRes,
	});
});

export const changePassword = asyncErrorHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	user.password = req.body.newPassword;
	user.PasswordChangedAt = Date.now();
	await user.save();

	sendAuthRes(res, user, 200);
});

export const acceptTeacher = asyncErrorHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	const locale = req.getLocale();

	const options = {
		from: 'Tawjihi support',
		to: user.email,
		subject: req.__('emails.accept_teacher.subject'),
		html: acceptTeacherTemp(user.name, locale),
	};

	try {
		await sendEmail(options);
		res.status(200).json({ status: 'success' });
	} catch (error) {
		throw new CustomError(req.__('generic.something_went_wrong_sending_email'), 500);
	}
});

export const refuseTeacher = asyncErrorHandler(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);
	const locale = req.getLocale();

	const options = {
		from: 'Tawjihi support',
		to: user.email,
		subject: req.__('emails.refuse_teacher.subject'),
		html: refuseTeacherTemp(user.name, user.isActive, locale),
	};

	try {
		await sendEmail(options);
		res.status(204).send();
	} catch (error) {
		throw new CustomError(req.__('generic.something_went_wrong_sending_email'), 500);
	}
});
