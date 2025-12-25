import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import extractPublicId from '../utils/extractPublicId.js';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'name is required'],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, 'email is required'],
			unique: [true, 'email must be unique'],
			lowercase: true,
		},
		description: {
			type: String,
			minlength: 10,
			maxlength: 1000,
		},
		googleId: String,
		facebookId: String,
		password: {
			type: String,
			minlength: 8,
			select: false,
		},
		phone: {
			type: String,
		},
		coverImage: String,
		cv: String,
		role: {
			type: String,
			enum: ['admin', 'teacher', 'user'],
			default: 'user',
		},
		wishlist: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Course',
			},
		],
		resetPasswordCode: String,
		resetPasswordCodeExpired: Date,
		resetPasswordCodeVerified: Boolean,
		PasswordChangedAt: Date,
		isActive: {
			type: Boolean,
			default: true,
		},
		reviewsQuantity: Number,
		averageRating: {
			type: Number,
			min: 0,
			max: 5,
		},
	},
	{
		timestamps: true,
	},
);

UserSchema.post(/delete/i, async (doc, next) => {
	if (doc.coverImage) {
		if (doc.coverImage.includes('cloudinary')) {
			const publicKey = extractPublicId(doc.coverImage, { resource_type: 'image' });
			try {
				await cloudinary.uploader.destroy(publicKey);
			} catch (error) {
				console.log(error);
			}
		}
	}

	if (doc.cv) {
		if (doc.cv.includes('cloudinary')) {
			const publicKey = extractPublicId(doc.cv);
			try {
				await cloudinary.uploader.destroy(publicKey, { resource_type: 'raw' });
			} catch (error) {
				console.log(error);
			}
		}
	}
	next();
});

UserSchema.pre(/^find/, function name(next) {
	this.populate({
		path: 'wishlist',
	});
	next();
});

UserSchema.pre('save', function (next) {
	if (!this.isModified('password')) return next();
	this.password = bcryptjs.hashSync(this.password, 10);
	next();
});

export default mongoose.model('User', UserSchema);
