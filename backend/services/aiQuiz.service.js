/* eslint-disable func-style */
import crypto from 'crypto';
import fetch from 'node-fetch';

// Ollama (مفعّل للاختبارات)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini';

/**
 * Safely parse JSON without throwing. Returns null on failure.
 * @param {string} text
 * @returns {any|null}
 */
function safeJsonParse(text) {
	try {
		return JSON.parse(text);
	} catch (err) {
		return null;
	}
}

/**
 * Extract the first JSON object/array found in a string.
 * It tries to find the first '{' or '[' then parse progressively.
 * @param {string} text
 * @returns {any}
 */
function extractJSON(text) {
	if (!text || typeof text !== 'string') {
		throw new Error('Model output was empty or not a string.');
	}

	// 1) Strip markdown code fences if present
	// ```json ... ```
	text = text
		.replace(/^```(?:json)?\s*/i, '')
		.replace(/\s*```$/i, '')
		.trim();

	// 2) Find earliest JSON start
	const objStart = text.indexOf('{');
	const arrStart = text.indexOf('[');
	if (objStart === -1 && arrStart === -1) {
		throw new Error('No JSON object/array start found in output.');
	}

	const start =
		objStart === -1 ? arrStart : arrStart === -1 ? objStart : Math.min(objStart, arrStart);

	let slice = text.slice(start).trim();

	// 3) Fix common invalid JSON: raw newlines inside quoted strings.
	// Replace real newline chars with \n ONLY when we are inside quotes.
	// Lightweight state machine.
	let fixed = '';
	let inString = false;
	let escape = false;

	for (let i = 0; i < slice.length; i++) {
		const ch = slice[i];

		if (escape) {
			fixed += ch;
			escape = false;
			continue;
		}

		if (ch === '\\') {
			fixed += ch;
			escape = true;
			continue;
		}

		if (ch === '"') {
			fixed += ch;
			inString = !inString;
			continue;
		}

		if (inString && (ch === '\n' || ch === '\r' || ch === '\t')) {
			// escape control characters inside strings
			if (ch === '\n') fixed += '\\n';
			else if (ch === '\r') fixed += '\\r';
			else fixed += '\\t';
			continue;
		}

		fixed += ch;
	}

	slice = fixed;

	// 4) Try parsing with shrinking tail until valid JSON
	for (let end = slice.length; end > 0; end--) {
		const candidate = slice.slice(0, end).trim();
		const parsed = safeJsonParse(candidate);
		if (parsed !== null) return parsed;
	}

	throw new Error('Failed to parse JSON from model output.');
}

/**
 * Validate quiz schema.
 * Expected:
 * {
 *   questions: [
 *     {
 *       question: string,
 *       options: string[],
 *       correctAnswer: string,
 *       explanation?: string,
 *       difficulty?: "easy"|"medium"|"hard",
 *       tags?: string[]
 *     }
 *   ],
 *   metadata?: {...}
 * }
 * @param {any} quiz
 */
function validateQuiz(quiz) {
	if (!quiz || typeof quiz !== 'object') {
		throw new Error('Quiz validation failed: quiz must be an object.');
	}

	const { questions } = quiz;
	if (!Array.isArray(questions) || questions.length < 1) {
		throw new Error('Quiz validation failed: questions must be an array with at least 1 item.');
	}

	for (const [i, q] of questions.entries()) {
		if (!q || typeof q !== 'object') {
			throw new Error(`Quiz validation failed: question #${i + 1} must be an object.`);
		}
		if (typeof q.question !== 'string' || !q.question.trim()) {
			throw new Error(
				`Quiz validation failed: question #${i + 1} must have a non-empty "question" string.`,
			);
		}
		if (!Array.isArray(q.options) || q.options.length < 2) {
			throw new Error(
				`Quiz validation failed: question #${i + 1} must have "options" array (>=2).`,
			);
		}
		if (typeof q.correctAnswer !== 'string' || !q.correctAnswer.trim()) {
			throw new Error(
				`Quiz validation failed: question #${i + 1} must have a non-empty "correctAnswer" string.`,
			);
		}
	}
}

/**
 * Build prompt for generating a quiz from lesson content.
 * @param {object} params
 * @returns {string}
 */
function buildPrompt({
	lessonText,
	lessonObjectives,
	grade,
	subject,
	language,
	numQuestions,
	difficulty,
	questionTypes,
	distribution,
	lessonTitle,
	courseTitle,
}) {
	const objectives =
		Array.isArray(lessonObjectives) && lessonObjectives.length
			? lessonObjectives.map((o) => `- ${o}`).join('\n')
			: 'N/A';

	const types =
		Array.isArray(questionTypes) && questionTypes.length
			? questionTypes.join(', ')
			: 'Multiple Choice';

	const dist =
		distribution && typeof distribution === 'object'
			? JSON.stringify(distribution, null, 2)
			: 'N/A';

	// NOTE: Your original file included Arabic/JSON-only constraints; keep them.
	return `
You are a professional educational quiz generator.

CONTEXT:
- Course Title: ${courseTitle || 'N/A'}
- Lesson Title: ${lessonTitle || 'N/A'}
- Grade: ${grade || 'N/A'}
- Subject: ${subject || 'N/A'}
- Language: ${language || 'Arabic'}
- Difficulty: ${difficulty || 'medium'}
- Number of Questions: ${numQuestions || 10}
- Question Types: ${types}
- Distribution (if any): ${dist}

LESSON OBJECTIVES:
${objectives}

LESSON CONTENT:
"""
${lessonText}
"""

TASK:
Generate a quiz strictly based on the lesson content above.

OUTPUT TEMPLATE (fill it, keep same keys):
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": "",
      "explanation": ""
    }
  ],
  "metadata": {
    "language": "...",
    "grade": "...",
    "subject": "...",
    "lessonTitle": "...",
    "courseTitle": "..."
  }
}

RULES:
- Ensure correctAnswer exactly matches one of the options.
- Ensure options are plausible and not trivial.
- Do not invent facts outside the lesson content.
- Questions must be clear and appropriate for the target grade/subject.
- Do NOT wrap the JSON in \`\`\`json fences.
- Do NOT include any newline characters inside JSON strings (use \\n if needed).

IMPORTANT:
Return ONLY raw JSON.
Do NOT use markdown, bullets, asterisks, headings, or any extra text.
The first character of your output MUST be "{" and the last character MUST be "}".

Now produce the JSON only.

Now produce the JSON only.
`.trim();
}

/**
 * Generate an AI quiz via Ollama-compatible endpoint.
 * @param {object} params
 * @returns {Promise<any>}
 */
export async function generateQuiz({
	lessonText,
	lessonObjectives = [],
	grade,
	subject,
	language = 'Arabic',
	numQuestions = 10,
	difficulty = 'medium',
	questionTypes = ['multiple_choice'],
	distribution,
	lessonTitle,
	courseTitle,
}) {
	const prompt = buildPrompt({
		lessonText,
		lessonObjectives,
		grade,
		subject,
		language,
		numQuestions,
		difficulty,
		questionTypes,
		distribution,
		lessonTitle,
		courseTitle,
	});

	let responseText;
	try {
		console.log(`Calling Ollama model=${OLLAMA_BASE_URL}...`);
		const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				model: OLLAMA_MODEL,
				prompt,
				stream: false,
			}),
		});

		console.log('Ollama response status:', res.status);

		if (!res.ok) {
			const body = await res.text();
			throw new Error(
				`Ollama request failed with status ${res.status}: ${body || res.statusText}`,
			);
		}

		const raw = await res.text();

		let parsed;
		try {
			parsed = JSON.parse(raw);
		} catch (e) {
			parsed = null;
		}

		responseText = parsed && typeof parsed.response === 'string' ? parsed.response : raw;
		console.log('Ollama raw (first 300 chars):', raw.slice(0, 300));
		console.log('Model text (first 300 chars):', responseText.slice(0, 300));
	} catch (err) {
		throw new Error(`Failed to call Ollama: ${err.message}`);
	}

	let quizJSON;
	try {
		console.log('Model text (last 500 chars):', responseText.slice(-500));

		quizJSON = extractJSON(responseText);
		// If model returned a single-question schema, map it to our schema
		if (
			quizJSON &&
			!quizJSON.questions &&
			quizJSON.question &&
			Array.isArray(quizJSON.answers)
		) {
			const options = quizJSON.answers
				.map((a) => (a && typeof a.text === 'string' ? a.text.trim() : ''))
				.filter(Boolean)
				.slice(0, 4);

			quizJSON = {
				questions: [
					{
						question: String(quizJSON.question || '').trim(),
						options,
						// fallback: pick first option if unknown (better: enforce in prompt)
						correctAnswer: options[0] || '',
						explanation: '',
					},
				],
				metadata: quizJSON.metadata || undefined,
			};
		}
	} catch (err) {
		throw new Error(`Could not extract JSON from model output: ${err.message}`);
	}

	// Optional: attach metadata if missing
	if (!quizJSON.metadata) {
		quizJSON.metadata = {
			language,
			grade,
			subject,
			lessonTitle,
			courseTitle,
		};
	}

	validateQuiz(quizJSON);
	return quizJSON;
}

/**
 * Generate a unique quiz id.
 * @returns {string}
 */
export function generateQuizId() {
	return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}
