import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer, { memoryStorage } from 'multer';
import { fileURLToPath } from 'url';
import Enrollment from '../models/Enrollment.js';
import AiChatLog from '../models/AiChatLog.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { collectContext, generateChatCompletion } from '../services/aiChat.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_MSG_LEN = 800;
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB
const CHAT_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'chat');
const chatUpload = multer({
	storage: memoryStorage(),
	limits: { fileSize: MAX_ATTACHMENT_BYTES, files: 3 },
});

export const uploadChatAttachments = chatUpload.array('attachments', 3);

const saveAttachments = (files = []) => {
	if (!files.length) return [];
	if (!fs.existsSync(CHAT_UPLOAD_DIR)) {
		fs.mkdirSync(CHAT_UPLOAD_DIR, { recursive: true });
	}

	const allowedDocs = new Set([
		'application/pdf',
		'text/plain',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	]);

	return files.map((file) => {
		const { mimetype, originalname, buffer, size } = file;
		const isImage = mimetype?.startsWith('image/');
		const isAllowed = isImage || allowedDocs.has(mimetype);
		if (!isAllowed) throw new CustomError('Unsupported attachment type.', 400);
		if (size > MAX_ATTACHMENT_BYTES) throw new CustomError('Attachment too large (max 5MB).', 400);

		const extFromName = path.extname(originalname || '').slice(0, 8);
		const fallbackExt = isImage
			? `.${(mimetype || '').split('/')[1] || 'img'}`
			: `.${(mimetype || '').split('/')[1] || 'bin'}`;
		const ext = extFromName || fallbackExt;

		const name = `chat-${crypto.randomUUID()}${ext}`;
		const filePath = path.join(CHAT_UPLOAD_DIR, name);
		fs.writeFileSync(filePath, buffer);

		return {
			url: `/uploads/chat/${name}`,
			originalName: originalname || name,
			mimeType: mimetype || 'application/octet-stream',
			size,
		};
	});
};

export const chatWithAi = asyncErrorHandler(async (req, res) => {
	const { message, courseId } = req.body || {};
	if (!message || !message.trim()) throw new CustomError('message is required.', 400);
	if (message.length > MAX_MSG_LEN) throw new CustomError('message too long.', 400);

	const userId = req.user?._id;
	const enrollments = await Enrollment.find({ user: userId }).select('course').lean();
	if (!enrollments.length) throw new CustomError('No enrolled courses.', 403);

	const enrolledCourseIds = enrollments.map((e) => e.course);

	if (courseId && !enrolledCourseIds.map(String).includes(String(courseId))) {
		throw new CustomError('Not enrolled in this course.', 403);
	}

	const targetCourses = courseId ? [courseId] : enrolledCourseIds;

	const rawFiles = [];
	if (req.file) rawFiles.push(req.file);
	if (Array.isArray(req.files)) rawFiles.push(...req.files);
	if (req.files && !Array.isArray(req.files) && typeof req.files === 'object') {
		Object.values(req.files).forEach((group) => {
			if (Array.isArray(group)) rawFiles.push(...group);
		});
	}
	const attachments = saveAttachments(rawFiles);

	const hostPrefix = `${req.protocol}://${req.get('host') || ''}`.replace(/\/$/, '');
	const attachmentsSummary = attachments
		.map((a) => {
			const sizeKb = Math.max(1, Math.round(a.size / 1024));
			return `${a.originalName} (${a.mimeType}, ${sizeKb}KB) - ${hostPrefix}${a.url}`;
		})
		.join('\n');

	const messageForModel = attachmentsSummary
		? `${message}\n\n[User attachments]\n${attachmentsSummary}`
		: message;

	const { contexts, inScope } = await collectContext({
		courseIds: targetCourses,
		message,
	});

	if (!inScope) {
		await AiChatLog.create({
			user: userId,
			role: 'student',
			message,
			attachments,
			inScope: false,
			citations: [],
		});
		return res.json({ inScope: false, answer: null, citations: [], attachments });
	}

	const result = await generateChatCompletion({ message: messageForModel, contexts });

	await AiChatLog.create({
		user: userId,
		role: 'student',
		message,
		attachments,
		answer: result.answer,
		inScope: result.inScope,
		citations: result.citations,
		model: result.model,
		tokensApprox: result.tokensApprox,
		durationMs: result.durationMs,
	});

	return res.json({
		inScope: result.inScope,
		answer: result.answer,
		citations: result.citations,
		attachments,
	});
});
