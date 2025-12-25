import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema(
	{
		type: {
			type: String,
			enum: ['mcq', 'true_false', 'fill_blank', 'short_answer'],
			required: true,
			trim: true,
		},
		question: { type: String, required: true, trim: true },
		options: { type: [String], default: [] }, // used for mcq
		// mcq/fill_blank/short_answer use strings; true_false uses boolean; fill_blank can have multiple accepted strings.
		answer: { type: Schema.Types.Mixed, required: true },
		explanation: { type: String, default: '', trim: true },
		tags: { type: [String], default: [] },
		language: { type: String, default: 'en', trim: true },
	},
	{ _id: false },
);

const quizSchema = new Schema(
	{
		course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
		lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
		teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, default: '', trim: true },
		difficulty: {
			type: String,
			enum: ['easy', 'medium', 'hard'],
			default: 'medium',
			trim: true,
		},
		tags: { type: [String], default: [] },
		language: { type: String, default: 'en', trim: true },
		aiGenerated: { type: Boolean, default: false },
		sourceTextHash: { type: String, default: '', trim: true },
		status: {
			type: String,
			enum: ['draft', 'published'],
			default: 'draft',
			trim: true,
		},
		questions: { type: [questionSchema], default: [] },
	},
	{ timestamps: true },
);

export default mongoose.model('Quiz', quizSchema);
