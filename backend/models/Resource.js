import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true },
);

export default resourceSchema;
