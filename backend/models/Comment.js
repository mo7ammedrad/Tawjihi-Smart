import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
	{
		lesson: {
			type: mongoose.Types.ObjectId,
			ref: 'Lesson',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: [true, 'Review comment is required'],
			trim: true,
			maxlength: [500, 'Review comment must be less than 500 characters'],
		},
	},
	{
		timestamps: true,
	},
);

commentSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'lesson',
		select: 'name',
	});

	this.populate({
		path: 'user',
		select: 'name coverImage',
	});

	next();
});

export default mongoose.model('Comment', commentSchema);
