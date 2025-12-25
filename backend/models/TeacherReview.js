import mongoose from 'mongoose';

const teacherReviewSchema = new mongoose.Schema(
	{
		teacher: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		comment: {
			type: String,
			required: [true, 'Review comment is required'],
			trim: true,
			maxlength: [500, 'Review comment must be less than 500 characters'],
		},
		rating: {
			type: Number,
			required: [true, 'Review rating is required'],
			min: [1, 'Rating must be at least 1'],
			max: [5, 'Rating must be at most 5'],
		},
	},
	{
		timestamps: true,
	},
);

teacherReviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'teacher',
		select: 'name',
	});

	this.populate({
		path: 'user',
		select: 'name',
	});

	next();
});

const updateTeacherReviewsQuantityAndAverageRating = async function (doc) {
	const teacher = await mongoose.model('User').findById(doc.teacher);

	const match = doc.teacher._id ? { teacher: doc.teacher._id } : { teacher: doc.teacher };

	const statistics = await mongoose.model('TeacherReview').aggregate([
		{
			$match: match,
		},
		{
			$group: {
				_id: '$teacher',
				averageRating: { $avg: '$rating' },
				reviewsQuantity: { $sum: 1 },
			},
		},
	]);

	if (statistics.length > 0) {
		teacher.reviewsQuantity = statistics[0].reviewsQuantity;
		teacher.averageRating = statistics[0].averageRating;
	} else {
		teacher.reviewsQuantity = 0;
		teacher.averageRating = 0;
	}

	await teacher.save();
};

teacherReviewSchema.post('save', async (doc, next) => {
	await updateTeacherReviewsQuantityAndAverageRating(doc);
	next();
});
teacherReviewSchema.post('findOneAndUpdate', async (doc, next) => {
	await updateTeacherReviewsQuantityAndAverageRating(doc);
	next();
});
teacherReviewSchema.post('findOneAndDelete', async (doc, next) => {
	await updateTeacherReviewsQuantityAndAverageRating(doc);
	next();
});

export default mongoose.model('TeacherReview', teacherReviewSchema);
