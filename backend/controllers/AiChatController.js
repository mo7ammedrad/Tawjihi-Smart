import Enrollment from '../models/Enrollment.js';
import AiChatLog from '../models/AiChatLog.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { collectContext, generateChatCompletion } from '../services/aiChat.service.js';

const MAX_MSG_LEN = 800;

export const chatWithAi = asyncErrorHandler(async (req, res) => {
	const started = Date.now();

	try {
		const { message, courseId } = req.body || {};

		console.log('\n[AI_CHAT_CTRL] ===== Incoming /ai/chat =====');
		console.log('[AI_CHAT_CTRL] userId:', req.user?._id?.toString?.());
		console.log('[AI_CHAT_CTRL] courseId:', courseId);
		console.log('[AI_CHAT_CTRL] messageLen:', message?.length);
		console.log('[AI_CHAT_CTRL] messagePreview:', (message || '').slice(0, 200));

		if (!message || !message.trim()) throw new CustomError('message is required.', 400);
		if (message.length > MAX_MSG_LEN) throw new CustomError('message too long.', 400);

		const userId = req.user?._id;
		const enrollments = await Enrollment.find({ user: userId }).select('course').lean();

		console.log('[AI_CHAT_CTRL] enrollments count:', enrollments.length);

		if (!enrollments.length) throw new CustomError('No enrolled courses.', 403);

		// NOTE: enrollment.course may be ObjectId OR populated course object (depends on your schema/populate)
		const enrolledCourseItems = enrollments.map((e) => e.course);

		// Validate enrollment if a specific courseId is provided
		if (courseId) {
			const enrolledIdsAsString = enrolledCourseItems
				.map((c) => (c?._id ? String(c._id) : String(c)))
				.filter(Boolean);

			console.log('[AI_CHAT_CTRL] enrolledIdsAsString:', enrolledIdsAsString);

			if (!enrolledIdsAsString.includes(String(courseId))) {
				throw new CustomError('Not enrolled in this course.', 403);
			}
		}

		const targetCourses = courseId ? [courseId] : enrolledCourseItems;

		console.log('[AI_CHAT_CTRL] targetCourses sample:', targetCourses?.[0]);

		const { contexts, inScope } = await collectContext({
			courseIds: targetCourses,
			message,
		});

		console.log('[AI_CHAT_CTRL] inScope:', inScope);
		console.log('[AI_CHAT_CTRL] contexts count:', contexts?.length || 0);
		console.log(
			'[AI_CHAT_CTRL] contexts titles:',
			(contexts || []).map((c) => c.lessonTitle).slice(0, 6),
		);

		if (!inScope) {
			await AiChatLog.create({
				user: userId,
				role: 'student',
				message,
				inScope: false,
				citations: [],
			});
			const durationMs = Date.now() - started;
			console.log('[AI_CHAT_CTRL] ✅ done (out of scope) in', durationMs, 'ms');
			return res.status(200).json({ inScope: false, answer: null, citations: [] });
		}

		let result;
		try {
			result = await generateChatCompletion({ message, contexts });
		} catch (err) {
			// IMPORTANT: return 200 with error details so you can see the root cause
			console.error('[AI_CHAT_ERROR] ❌ generateChatCompletion failed:', err);
			console.error('[AI_CHAT_ERROR] message:', err?.message);
			console.error('[AI_CHAT_ERROR] stack:', err?.stack);

			const durationMs = Date.now() - started;

			return res.status(200).json({
				inScope: false,
				answer: 'تعذر الحصول على إجابة الآن. يرجى المحاولة لاحقاً.',
				citations: [],
				error: err?.message || String(err),
				stack: err?.stack || null,
				durationMs,
			});
		}

		await AiChatLog.create({
			user: userId,
			role: 'student',
			message,
			answer: result.answer,
			inScope: result.inScope,
			citations: (result.citations || []).map((c) => ({
				lesson: c.lessonId,
				course: c.courseId,
				lessonTitle: c.lessonTitle,
				courseTitle: c.courseTitle,
			})),
			model: result.model,
			tokensApprox: result.tokensApprox,
			durationMs: result.durationMs,
		});

		const durationMs = Date.now() - started;
		console.log('[AI_CHAT_CTRL] ✅ done in', durationMs, 'ms');
		console.log('[AI_CHAT_CTRL] model:', result.model);
		console.log('[AI_CHAT_CTRL] answerLen:', result.answer?.length);

		return res.status(200).json({
			inScope: result.inScope,
			answer: result.answer,
			citations: result.citations,
			model: result.model,
			durationMs,
		});
	} catch (err) {
		// Let your global error middleware handle it, but log first
		console.error('[AI_CHAT_CTRL_FATAL] ❌', err);
		throw err;
	}
});
