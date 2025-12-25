import mongoose from 'mongoose';
import resourceSchema from './Resource.js';
import cloudinary from '../config/cloudinary.js';
import extractPublicId from '../utils/extractPublicId.js';

const lessonSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		contentText: {
			type: String,
			default: '',
			trim: true,
		},
		pdfUrl: {
			type: String,
			default: '',
			trim: true,
		},
		video: {
			type: String,
			required: true,
			trim: true,
		},
		duration: {
			type: Number,
			required: true,
			min: 0,
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		resources: [resourceSchema],
	},
	{ timestamps: true },
);

lessonSchema.post(/delete/i, async (doc, next) => {
	if (doc.video) {
		if (doc.video.includes('cloudinary')) {
			const publicKey = extractPublicId(doc.video);
			try {
				await cloudinary.uploader.destroy(publicKey, { resource_type: 'video' });
			} catch (error) {
				console.log(error);
			}
		}
	}

	if (doc.resources.length !== 0) {
		const promises = doc.resources.map((resource) => {
			if (resource.includes('cloudinary')) {
				const publicKey = extractPublicId(resource);
				return cloudinary.uploader.destroy(publicKey, { resource_type: 'raw' });
			}
			return Promise.resolve();
		});

		try {
			await Promise.all(promises);
		} catch (error) {
			console.log(error);
		}
	}

	next();
});

export default mongoose.model('Lesson', lessonSchema);
