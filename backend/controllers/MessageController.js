import Message from '../models/Message.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

export const sendMessage = asyncErrorHandler(async (req, res) => {
	const { to, subject, body } = req.body;
	if (!to || !body) throw new CustomError('recipient and body are required.', 400);
	const msg = await Message.create({
		sender: req.user._id,
		recipient: to,
		subject: subject || '',
		body,
	});
	res.status(201).json({ message: msg });
});

export const inbox = asyncErrorHandler(async (req, res) => {
	const { unreadCount } = req.query;
	if (unreadCount) {
		const count = await Message.countDocuments({ recipient: req.user._id, read: false });
		return res.json({ unread: count });
	}
	const messages = await Message.find({ recipient: req.user._id })
		.sort({ createdAt: -1 })
		.populate('sender', 'name email role')
		.populate('recipient', 'name email role');
	res.json({ messages });
});

export const sent = asyncErrorHandler(async (req, res) => {
	const messages = await Message.find({ sender: req.user._id })
		.sort({ createdAt: -1 })
		.populate('sender', 'name email role')
		.populate('recipient', 'name email role');
	res.json({ messages });
});

export const markRead = asyncErrorHandler(async (req, res) => {
	const { id } = req.params;
	const msg = await Message.findOneAndUpdate(
		{ _id: id, recipient: req.user._id },
		{ read: true },
		{ new: true },
	);
	if (!msg) throw new CustomError('Message not found.', 404);
	res.json({ message: msg });
});
