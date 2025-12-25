import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { getVideoDurationInSeconds } from 'get-video-duration';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadMultipleFields } from '../middlewares/uploadsMiddleware.js';
import { getAll, createOne, getOne, updateOne, deleteOne } from './controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadLessonVideo = uploadMultipleFields([
	{ name: 'video', maxCount: 1 },
	{ name: 'pdf', maxCount: 1 },
]);

export const handleVideo = asyncErrorHandler(async (req, res, next) => {
	const videoFile = req.files?.video?.[0];
	const pdfFile = req.files?.pdf?.[0];

	if (videoFile) {
		const { mimetype } = videoFile;
		if (!mimetype.startsWith('video'))
			throw new CustomError(req.__('generic.invalid_file_type_for_video'), 400);

		const unique = crypto.randomUUID();
		const ext = mimetype.split('/')[1];
		const name = `lesson-${unique}-${Date.now()}.${ext}`;
		const uploadDir = path.join(__dirname, '..', 'uploads', 'lessons', 'videos');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, name);
		fs.writeFileSync(filePath, videoFile.buffer);

		const duration = Math.round(await getVideoDurationInSeconds(filePath));

		req.body.duration = duration;
		req.body.video = `/uploads/lessons/videos/${name}`;

		req.upload = 'lesson';
		req.filePath = filePath;
	}

	if (pdfFile) {
		if (pdfFile.mimetype !== 'application/pdf') {
			throw new CustomError('Invalid PDF file type', 400);
		}
		const uniquePdf = crypto.randomUUID();
		const pdfName = `lesson-${uniquePdf}-${Date.now()}.pdf`;
		const pdfDir = path.join(__dirname, '..', 'uploads', 'lessons', 'files');
		if (!fs.existsSync(pdfDir)) {
			fs.mkdirSync(pdfDir, { recursive: true });
		}
		const pdfPath = path.join(pdfDir, pdfName);
		fs.writeFileSync(pdfPath, pdfFile.buffer);
		req.body.pdfUrl = `/uploads/lessons/files/${pdfName}`;
	}

	next();
});

export const getAllLessons = getAll(Lesson);

export const createLesson = createOne(Lesson);

export const getLesson = getOne(Lesson, 'Lesson');

export const updateLesson = updateOne(Lesson, 'Lesson');

export const deleteLesson = deleteOne(Lesson, 'Lesson');
