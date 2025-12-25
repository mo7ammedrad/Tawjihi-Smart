import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import extractPublicId from '../utils/extractPublicId.js';

const newSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		coverImage: String,
	},
	{
		timestamps: true,
	},
);

newSchema.post(/delete/i, async (doc, next) => {
	if (doc.coverImage) {
		if (doc.coverImage.includes('cloudinary')) {
			const publicKey = extractPublicId(doc.coverImage);
			try {
				await cloudinary.uploader.destroy(publicKey, { resource_type: 'image' });
			} catch (error) {
				console.log(error);
			}
		}
	}

	next();
});

export default mongoose.model('New', newSchema);
