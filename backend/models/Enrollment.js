import mongoose from 'mongoose';
import Cart from './Cart.js';

const enrollmentSchema = new mongoose.Schema(
	{
		course: {
			type: mongoose.Types.ObjectId,
			ref: 'Course',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

enrollmentSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'course',
	});

	this.populate({
		path: 'user',
		select: 'name email',
	});

	next();
});

enrollmentSchema.post('save', async (doc, next) => {
	const cart = await Cart.findOne({ user: doc.user });
	if (cart) {
		const index = cart.courses.findIndex((course) => course.id === doc.course.toString());
		if (index !== -1) {
			cart.totalPrice -= cart.courses[index].price;
			cart.courses = cart.courses.filter((course) => course.id !== doc.course.toString());
			await cart.save();
		}
	}
	next();
});

export default mongoose.model('Enrollment', enrollmentSchema);
