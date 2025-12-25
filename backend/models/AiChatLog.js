import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const citationSchema = new Schema(
	{
		lesson: { type: Types.ObjectId, ref: 'Lesson' },
		course: { type: Types.ObjectId, ref: 'Course' },
		lessonTitle: String,
		courseTitle: String,
	},
	{ _id: false },
);

const aiChatLogSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User', required: true },
		role: { type: String, default: 'student' },
		message: { type: String, required: true, trim: true },
		answer: { type: String, default: '' },
		inScope: { type: Boolean, default: true },
		citations: { type: [citationSchema], default: [] },
		model: { type: String, default: '' },
		tokensApprox: { type: Number, default: 0 },
		durationMs: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

aiChatLogSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('AiChatLog', aiChatLogSchema);
