import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		subject: { type: String, default: '', trim: true },
		body: { type: String, required: true, trim: true },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

messageSchema.index({ recipient: 1, read: 1 });

export default mongoose.model('Message', messageSchema);
