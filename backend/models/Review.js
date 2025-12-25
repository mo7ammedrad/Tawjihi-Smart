import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
		comment: {
			type: String,
			required: [true, 'Review comment is required'],
			trim: true,
			maxlength: [500, 'Review comment must be less than 500 characters'],
		},
		rating: {
			type: Number,
			required: [true, 'Review rating is required'],
			min: [0, 'Rating must be at least 1'],
			max: [5, 'Rating must be at most 5'],
		},
	},
	{
		timestamps: true,
	},
);

reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'course',
		select: 'name',
	});

	this.populate({
		path: 'user',
		select: 'name',
	});

	next();
});

const updateCourseReviewsQuantityAndAverageRating = async function (doc) {
	const course = await mongoose.model('Course').findById(doc.course);

	const match = doc.course._id ? { course: doc.course._id } : { course: doc.course };

	const statistics = await mongoose.model('Review').aggregate([
		{
			$match: match,
		},
		{
			$group: {
				_id: '$course',
				averageRating: { $avg: '$rating' },
				reviewsQuantity: { $sum: 1 },
			},
		},
	]);

	if (statistics.length > 0) {
		course.reviewsQuantity = statistics[0].reviewsQuantity;
		course.averageRating = statistics[0].averageRating;
	} else {
		course.reviewsQuantity = 0;
		course.averageRating = 0;
	}
	await course.save();
};

reviewSchema.post('save', async (doc, next) => {
	await updateCourseReviewsQuantityAndAverageRating(doc);
	next();
});
reviewSchema.post('findOneAndUpdate', async (doc, next) => {
	await updateCourseReviewsQuantityAndAverageRating(doc);
	next();
});
reviewSchema.post('findOneAndDelete', async (doc, next) => {
	await updateCourseReviewsQuantityAndAverageRating(doc);
	next();
});

export default mongoose.model('Review', reviewSchema);
