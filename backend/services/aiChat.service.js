/* eslint-disable func-style */
import crypto from 'crypto';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';

// Ollama (mistral) for chatbot
const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11435').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini';
const OLLAMA_GENERATE_URL = `${OLLAMA_BASE_URL}/api/generate`;

// Aggressive limits to keep responses fast
const MAX_CONTEXT_CHARS = Number(process.env.AI_MAX_CONTEXT_CHARS || 400);
const MAX_LESSONS = Number(process.env.AI_MAX_LESSONS || 1);

const tutorRules = [
	'أنت AI Tutor (مدرّس ذكي) لمنصة Tawjihi.',
	'استخدم فقط محتوى الدرس المرفق كمصدر معلومات.',
	'ممنوع أي معرفة خارجية أو تخمين.',
	'إذا لم توجد المعلومة في المحتوى: قل حرفيًا "هذا غير موجود في محتوى الدرس الذي لدي" واطلب تحديد الفقرة.',
	'الأسلوب: عربي واضح، مبسط، منظم، لطلاب التوجيهي.',
	'لا تعطي الحل النهائي مباشرة لأسئلة الواجب/الامتحان: اشرح الفكرة وقدّم تلميحات، واطلب المحاولة.',
	'إذا قال الطالب "مش فاهم": أعد الشرح بطريقة مختلفة (تشبيه/مثال آخر/تبسيط أكثر).',
	'إذا كان السؤال مباشرًا وسهلًا: أجب بإيجاز.',
	'الرد يجب أن يكون نصًا عربيًا فقط (بدون JSON أو شيفرة).',
	'إذا قال الطالب مرحباً أو سلام: رد بتحية قصيرة مثل "هلا، كيف أقدر أساعدك؟" ثم اسأله عن الدرس أو النقطة التي يريدها.',
];

const instructions = [
	...tutorRules,
	'اعتمد على السياق أدناه للإجابة، ولا تختلق معلومات غير موجودة.',
].join('\n');

export const collectContext = async ({ courseIds = [], message }) => {
	const courses = await Course.find({ _id: { $in: courseIds } })
		.select('name title')
		.lean();
	const courseTitleMap = courses.reduce((acc, c) => {
		acc[c._id.toString()] = c.name || c.title || 'Course';
		return acc;
	}, {});

	const lessons = await Lesson.find({ course: { $in: courseIds } })
		.select('name title description contentText course pdfUrl')
		.lean();

	if (!lessons.length) return { contexts: [], inScope: false };

	const terms = (message || '')
		.toLowerCase()
		.split(/[^a-zA-Z\u0600-\u06FF0-9]+/)
		.filter((t) => t.length > 3);

	const scored = lessons
		.map((l) => {
			const text = (l.contentText || l.description || '').toLowerCase();
			let score = 0;
			terms.forEach((t) => {
				if (text.includes(t)) score += 1;
			});
			return { lesson: l, score };
		})
		.sort((a, b) => b.score - a.score);

	const top = scored
		.slice(0, MAX_LESSONS)
		.filter((s) =>
			(s.lesson.contentText || s.lesson.description || s.lesson.pdfUrl || '').trim(),
		);
	if (!top.length) return { contexts: [], inScope: false };

	let usedChars = 0;
	const contexts = [];

	for (const { lesson } of top) {
		let textParts = [];
		if (lesson.contentText) textParts.push(String(lesson.contentText));
		if (lesson.description) textParts.push(String(lesson.description));

		// Skip PDF parsing to keep responses snappy; full-text PDFs can be slow.

		const raw = textParts.join('\n').trim();
		if (!raw) continue;
		const remaining = Math.max(0, MAX_CONTEXT_CHARS - usedChars);
		if (remaining <= 0) break;
		const snippet = raw.slice(0, remaining);
		usedChars += snippet.length;
		contexts.push({
			lessonId: lesson._id.toString(),
			courseId: lesson.course.toString(),
			lessonTitle: lesson.name || lesson.title || 'Lesson',
			courseTitle: courseTitleMap[lesson.course.toString()] || 'Course',
			text: snippet,
		});
	}

	return { contexts, inScope: contexts.length > 0 };
};

const buildPrompt = ({ message, contexts }) => {
	const contextStr = contexts
		.map(
			(c, idx) =>
				`[L${idx + 1}] ${c.lessonTitle} (${c.courseTitle})\n${c.text}\n(lessonId=${c.lessonId}, courseId=${c.courseId})`,
		)
		.join('\n\n');

	return [
		instructions,
		'Context:',
		contextStr || 'NO CONTEXT',
		'',
		`User Question: """${message}"""`,
		'الرد المطلوب: نص عربي واضح ومختصر، يُفضّل بنقاط قصيرة عند الحاجة. لا تُرجع JSON أو شيفرة.',
	].join('\n');
};

export const generateChatCompletion = async ({ message, contexts }) => {
	const prompt = buildPrompt({ message, contexts });
	const started = Date.now();

	let answerText = '';
	try {
		const res = await fetch(OLLAMA_GENERATE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				prompt,
				stream: false,
			}),
		});
		const raw = await res.text().catch(() => '');
		if (!res.ok) {
			throw new Error(`Ollama request failed with status ${res.status}: ${raw.slice(0, 400)}`);
		}
		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch {
			parsed = null;
		}
		answerText =
			parsed && typeof parsed.response === 'string' ? parsed.response.trim() : raw.trim();
		if (!answerText) throw new Error('Ollama returned an empty answer.');
	} catch (err) {
		console.error('[AI_CHAT_ERROR]', err.message);
		const durationMs = Date.now() - started;
		const answer =
			`تعذر الوصول لمزوّد الذكاء الاصطناعي حالياً. (تفاصيل: ${err.message})\n` +
			`يمكنك إعادة المحاولة لاحقاً أو تحديد جزء أدق من الدرس.`;

		return {
			inScope: contexts.length > 0,
			answer,
			citations: contexts.slice(0, 1).map((c) => ({
				lessonId: c.lessonId,
				courseId: c.courseId,
				lessonTitle: c.lessonTitle,
				courseTitle: c.courseTitle,
			})),
			model: OLLAMA_MODEL,
			durationMs,
			tokensApprox: Math.round((prompt.length + answer.length) / 4),
			raw: String(err.message || ''),
			sourceTextHash: crypto
				.createHash('sha256')
				.update(contexts.map((c) => c.text).join('\n'))
				.digest('hex'),
		};
	}

	const durationMs = Date.now() - started;
	const tokensApprox = Math.round((prompt.length + answerText.length) / 4);

	return {
		inScope: true,
		answer: answerText,
		citations: contexts.slice(0, 1).map((c) => ({
			lessonId: c.lessonId,
			courseId: c.courseId,
			lessonTitle: c.lessonTitle,
			courseTitle: c.courseTitle,
		})),
		model: OLLAMA_MODEL,
		durationMs,
		tokensApprox,
		raw: answerText,
		sourceTextHash: crypto
			.createHash('sha256')
			.update(contexts.map((c) => c.text).join('\n'))
			.digest('hex'),
	};
};
