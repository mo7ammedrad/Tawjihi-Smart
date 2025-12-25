import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import extractPublicId from '../utils/extractPublicId.js';

const CourseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			minlength: 10,
			maxlength: 1000,
		},
		coverImage: String,
		teacher: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		subject: {
			type: mongoose.Types.ObjectId,
			ref: 'Subject',
			required: true,
		},
		branches: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Branch',
				required: true,
			},
		],
		price: {
			type: Number,
			required: true,
		},
		priceAfterDiscount: {
			type: Number,
		},
		reviewsQuantity: {
			type: Number,
			default: 0,
		},
		averageRating: {
			type: Number,
			min: 0,
			max: 5,
			default: 0,
		},
		materialPdfUrl: {
			type: String,
		},
		materialPdfText: {
			type: String,
			default: '',
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

CourseSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'teacher',
		select: 'name _id description coverImage',
	})
		.populate({
			path: 'branches',
			select: 'name _id',
		})
		.populate({
			path: 'subject',
			select: 'name _id',
		});
	next();
});

CourseSchema.post(/delete/i, async (doc, next) => {
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

export default mongoose.model('Course', CourseSchema);
