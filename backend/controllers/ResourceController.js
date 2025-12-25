import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import Lesson from '../models/Lesson.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadContentFile = uploadSingleField('content');

// eslint-disable-next-line require-await
export const handleContentFile = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const { mimetype } = req.file;
		if (!mimetype.endsWith('pdf')) throw new CustomError(req.__('generic.invalid_file'), 400);
		const unique = crypto.randomUUID();
		const name = `resource-${unique}-${Date.now()}.pdf`;
		const uploadDir = path.join(__dirname, '..', 'uploads', 'lessons', 'resources');

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		const filePath = path.join(uploadDir, name);

		fs.writeFileSync(filePath, req.file.buffer);

		req.upload = 'resource';
		req.filePath = filePath;
	}
	next();
});

export const getAllResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);

	res.status(200).json({
		status: 'success',
		count: lesson.resources.length,
		data: {
			resources: lesson.resources,
		},
	});
});

export const createResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findByIdAndUpdate(
		req.params.lessonId,
		{
			$push: { resources: req.body },
		},
		{
			new: true,
			runValidators: true,
		},
	);

	res.status(201).json({
		status: 'success',
		count: lesson.resources.length,
		data: {
			resources: lesson.resources,
		},
	});
});

export const getResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);

	const [resource] = lesson.resources.filter(
		(resource) => resource._id.toString() === req.params.id,
	);

	res.status(200).json({
		status: 'success',
		data: {
			resource,
		},
	});
});

export const updateResource = asyncErrorHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.lessonId);
	const resourceIndex = lesson.resources.findIndex(
		(resource) => resource._id.toString() === req.params.id,
	);

	if (req.body.name) lesson.resources[resourceIndex].name = req.body.name;
	if (req.body.content) lesson.resources[resourceIndex].content = req.body.content;

	await lesson.save();

	res.status(200).json({
		status: 'success',
		data: {
			resource: lesson.resources[resourceIndex],
		},
	});
});

export const deleteResource = asyncErrorHandler(async (req, res) => {
	await Lesson.findByIdAndUpdate(
		req.params.lessonId,
		{
			$pull: { resources: { _id: req.params.id } },
		},
		{
			runValidators: true,
		},
	);

	res.status(204).send();
});
