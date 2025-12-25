import crypto from 'crypto';
import Quiz from '../models/Quiz.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { generateQuiz } from '../services/aiQuiz.service.js';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const MAX_TEXT_LEN = 20000;
const RECENT_DRAFT_WINDOW_MINUTES = 30;

export const generateAiQuiz = asyncErrorHandler(async (req, res) => {
	const { courseId, lessonId, nQuestions, difficulty, language, distribution } = req.body;
	const resolvedDistribution = {
		mcq: Number(distribution?.mcq ?? 0),
		true_false: Number(distribution?.true_false ?? 0),
		fill_blank: Number(distribution?.fill_blank ?? 0),
		short_answer: Number(distribution?.short_answer ?? 0),
	};
	const totalRequested =
		(resolvedDistribution.mcq || 0) +
		(resolvedDistribution.true_false || 0) +
		(resolvedDistribution.fill_blank || 0) +
		(resolvedDistribution.short_answer || 0);

	if (!courseId || !lessonId) {
		throw new CustomError('courseId and lessonId are required.', 400);
	}
	if (!nQuestions || Number(nQuestions) <= 0) {
		throw new CustomError('nQuestions must be a positive number.', 400);
	}
	if (totalRequested !== Number(nQuestions)) {
		throw new CustomError('distribution totals must equal nQuestions.', 400);
	}

	const lesson = await Lesson.findById(lessonId).lean();
	if (!lesson || String(lesson.course) !== String(courseId)) {
		throw new CustomError('Lesson not found for the given course.', 404);
	}
	const course = await Course.findById(courseId).lean();
	if (!course) {
		throw new CustomError('Course not found.', 404);
	}

	const contentParts = [];

	// Prefer PDF text if available
	const pdfUrl =
		lesson.pdfUrl ||
		(lesson.resources || []).find(
			(r) => typeof r === 'string' && r.toLowerCase().endsWith('.pdf'),
		);
	if (pdfUrl) {
		try {
			let buffer;
			if (pdfUrl.startsWith('http')) {
				const res = await fetch(pdfUrl);
				if (!res.ok) throw new Error(`fetch failed ${res.status}`);
				const arr = await res.arrayBuffer();
				buffer = Buffer.from(arr);
			} else {
				const pdfPath = path.join(process.cwd(), pdfUrl.replace(/^\//, ''));
				buffer = fs.readFileSync(pdfPath);
			}
			const parsed = await pdfParse(buffer);
			if (parsed.text) contentParts.push(parsed.text);
		} catch (e) {
			console.error('[PDF_PARSE_ERROR]', e.message);
		}
	}

	// Fallback to contentText/description
	if (lesson.contentText) contentParts.push(String(lesson.contentText));
	if (lesson.description) contentParts.push(String(lesson.description));

	let content = contentParts.join('\n').trim();

	if (!content) {
		throw new CustomError('Lesson content is empty. يرجى رفع PDF أو إضافة نص للدرس.', 400);
	}
	if (content.length > MAX_TEXT_LEN) {
		console.warn(
			`[AI_QUIZ_GEN] lesson content trimmed from ${content.length} to ${MAX_TEXT_LEN} chars`,
		);
		content = content.slice(0, MAX_TEXT_LEN);
	}

	const sourceTextHash = crypto.createHash('sha256').update(content).digest('hex');

	// Prevent duplicate generation: reuse recent draft with same source hash
	const recentDraft = await Quiz.findOne({
		lesson: lessonId,
		course: courseId,
		sourceTextHash,
		status: 'draft',
		aiGenerated: true,
		createdAt: { $gte: new Date(Date.now() - RECENT_DRAFT_WINDOW_MINUTES * 60 * 1000) },
	}).lean();

	if (recentDraft) {
		return res.json({
			quizId: recentDraft._id,
			questions: recentDraft.questions,
			reused: true,
		});
	}

	const started = Date.now();
	let quizData;
	try {
		quizData = await generateQuiz({
			lessonText: content,
			nQuestions: Number(nQuestions),
			difficulty,
			language,
			distribution: resolvedDistribution,
			lessonTitle: lesson.name || lesson.title || '',
			courseTitle: course.name || course.title || '',
		});
	} catch (err) {
		console.error('[AI_QUIZ_GEN_ERROR]', err);
		throw new CustomError(err.message || 'Failed to generate quiz.', 500);
	}

	const quizDoc = await Quiz.create({
		course: courseId,
		lesson: lessonId,
		teacher: req.user?._id,
		title: quizData.quizTitle || lesson.name || '',
		difficulty: quizData.difficulty || difficulty,
		language: quizData.language || language,
		aiGenerated: true,
		status: 'draft',
		questions: quizData.questions,
		tags: [],
		sourceTextHash,
	});

	const durationMs = Date.now() - started;
	const tokensApprox =
		quizData?.meta?.tokensApprox ??
		Math.round((content.length + JSON.stringify(quizData.questions || []).length) / 4);

	console.log(
		'[AI_QUIZ_GEN]',
		JSON.stringify({
			teacherId: req.user?._id,
			lessonId,
			durationMs,
			tokensApprox,
			quizId: quizDoc._id,
		}),
	);

	return res.json({
		quizId: quizDoc._id,
		questions: quizDoc.questions,
		reused: false,
	});
});
