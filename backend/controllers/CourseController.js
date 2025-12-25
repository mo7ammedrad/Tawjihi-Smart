import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import slugify from 'slugify';
import { fileURLToPath } from 'url'; // 👈 Add this import
import Course from '../models/Course.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';
import { uploadSingleField } from '../middlewares/uploadsMiddleware.js';
import { getAll, getOne, updateOne, deleteOne } from './controller.js';
// PDF upload removed per latest requirements

// --- Recreate __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // Gets the file path
const __dirname = path.dirname(__filename); // Gets the directory path

export const uploadCourseImage = uploadSingleField('coverImage');
// export const uploadCoursePdf = uploadSingleField('materialPdf');

export const handleCourseImage = asyncErrorHandler(async (req, res, next) => {
	if (req.file) {
		const unique = crypto.randomUUID();
		const name = `course-${unique}-${Date.now()}.jpeg`;

		// Now __dirname is defined and works correctly
		const uploadDir = path.join(__dirname, '..', 'uploads', 'images', 'courses');

		// Ensure directory exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const filePath = path.join(uploadDir, name);
		const buffer = await sharp(req.file.buffer)
			.resize(500, 500)
			.toFormat('jpeg')
			.jpeg({ quality: 90 })
			.toBuffer();

		fs.writeFileSync(filePath, buffer);
		req.upload = 'course';
		req.filePath = filePath;
	}
	next();
});

// export const handleCoursePdf = asyncErrorHandler(async (req, res, next) => {
// 	// PDF upload disabled
// 	next();
// });

export const getAllCourses = getAll(Course);

export const createCourse = asyncErrorHandler(async (req, res) => {
	if (req.body.name) req.body.slug = slugify(req.body.name);

	const newDoc = await Course.create(req.body);

	const users = await User.find({ role: 'user', isActive: true }).select('_id');
	const linkPath = `/courses/${newDoc.slug}/${newDoc._id}`;
	const docs = users.map((u) => ({
		recipient: u._id,
		createdBy: req.user?._id,
		type: 'course',
		title: `تمت إضافة دورة جديدة: ${newDoc.name}`,
		body: 'تمت إضافة دورة جديدة على المنصة ويمكنك تسجيل الدخول للاطلاع عليها.',
		link: linkPath,
		course: newDoc._id,
	}));

	if (docs.length) await Notification.insertMany(docs, { ordered: false });

	res.status(201).json({
		status: 'success',
		data: {
			newDoc,
		},
	});
});

export const getCourse = getOne(Course, 'Course');

export const updateCourse = updateOne(Course, 'Course');

export const deleteCourse = deleteOne(Course, 'Course');
