import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
	{
		recipient: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
		},
		type: {
			type: String,
			enum: ['course', 'message', 'news'],
			default: 'message',
			index: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		body: {
			type: String,
			trim: true,
			maxlength: 2000,
		},
		link: {
			type: String,
			trim: true,
		},
		course: {
			type: mongoose.Types.ObjectId,
			ref: 'Course',
		},
		news: {
			type: mongoose.Types.ObjectId,
			ref: 'New',
		},
		isRead: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
