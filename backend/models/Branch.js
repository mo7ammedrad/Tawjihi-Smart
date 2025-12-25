import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'name is required'],
			uniqe: [true, 'name must be uniqe'],
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

export default mongoose.model('Branch', branchSchema);
