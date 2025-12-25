import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
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
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Subject', subjectSchema);
