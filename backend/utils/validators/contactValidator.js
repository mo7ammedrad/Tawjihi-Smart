import { check } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware.js';

export const contactValidator = [
	check('name')
		.notEmpty()
		.withMessage('الاسم مطلوب')
		.isLength({ min: 2 })
		.withMessage('الاسم قصير جداً'),
	check('email')
		.notEmpty()
		.withMessage('البريد الإلكتروني مطلوب')
		.isEmail()
		.withMessage('البريد الإلكتروني غير صحيح'),
	check('message')
		.notEmpty()
		.withMessage('نص الرسالة مطلوب')
		.isLength({ min: 10, max: 5000 })
		.withMessage('طول الرسالة غير صحيح'),
	validationMiddleware,
];
