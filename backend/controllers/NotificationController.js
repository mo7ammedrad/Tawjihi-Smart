import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

const parseLimit = (value, fallback) => {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
	return Math.min(parsed, 100);
};

const normalizeRecipients = (recipients) => {
	if (!recipients) return null;
	const ids = Array.isArray(recipients) ? recipients : [recipients];
	const uniqueIds = [...new Set(ids)].filter(Boolean);

	for (const id of uniqueIds) {
		if (!mongoose.isValidObjectId(id)) {
			throw new CustomError('Invalid recipient id', 400);
		}
	}
	return uniqueIds;
};

const getTeacherAudience = async (teacherId) => {
	const teacherCourses = await Course.find({ teacher: teacherId }).select('_id');
	if (!teacherCourses.length) return [];
	const courseIds = teacherCourses.map((c) => c._id);
	return Enrollment.distinct('user', { course: { $in: courseIds } });
};

export const getMyNotifications = asyncErrorHandler(async (req, res) => {
	const limit = parseLimit(req.query.limit, 30);
	const unreadOnly = req.query.unreadOnly === 'true';

	const filter = { recipient: req.user._id };
	if (unreadOnly) filter.isRead = false;

	const docs = await Notification.find(filter)
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate({ path: 'createdBy', select: 'name role' });

	const unreadCount = await Notification.countDocuments({
		recipient: req.user._id,
		isRead: false,
	});

	res.status(200).json({
		status: 'success',
		data: {
			docs,
			unreadCount,
		},
	});
});

export const markNotificationRead = asyncErrorHandler(async (req, res) => {
	const { id } = req.params;
	if (!mongoose.isValidObjectId(id)) throw new CustomError('Invalid notification id', 400);

	const doc = await Notification.findOneAndUpdate(
		{ _id: id, recipient: req.user._id },
		{ isRead: true },
		{ new: true },
	);
	if (!doc) throw new CustomError('Notification not found', 404);

	res.status(200).json({
		status: 'success',
		data: { doc },
	});
});

export const markAllMyNotificationsRead = asyncErrorHandler(async (req, res) => {
	await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
	res.status(200).json({ status: 'success' });
});

export const broadcastNotification = asyncErrorHandler(async (req, res) => {
	const { title, body, link, recipients } = req.body;
	if (!title || typeof title !== 'string') throw new CustomError('title is required', 400);

	const normalizedRecipients = normalizeRecipients(recipients);

	let targetUserIds;
	if (normalizedRecipients) {
		targetUserIds = normalizedRecipients;
	} else if (req.user.role === 'admin') {
		const users = await User.find({ role: 'user', isActive: true }).select('_id');
		targetUserIds = users.map((u) => u._id);
	} else if (req.user.role === 'teacher') {
		targetUserIds = await getTeacherAudience(req.user._id);
	} else {
		throw new CustomError('Action not allowed', 403);
	}

	if (req.user.role === 'teacher') {
		const allowed = new Set((await getTeacherAudience(req.user._id)).map(String));
		targetUserIds = targetUserIds.filter((id) => allowed.has(String(id)));
	}

	if (!targetUserIds.length) {
		return res.status(200).json({
			status: 'success',
			data: { created: 0 },
		});
	}

	const docs = targetUserIds.map((recipientId) => ({
		recipient: recipientId,
		createdBy: req.user._id,
		type: 'message',
		title: title.trim(),
		body: typeof body === 'string' ? body.trim() : undefined,
		link: typeof link === 'string' ? link.trim() : undefined,
	}));

	await Notification.insertMany(docs, { ordered: false });

	res.status(201).json({
		status: 'success',
		data: { created: docs.length },
	});
});
