export default class QueryManipulator {
	/**
	 * @param {object} req - express request
	 * @param {Model} model - mongoose model
	 */
	constructor(req, model) {
		this.req = req;
		this.model = model;
		this.query = null;
		this.filterObj = {};
	}

	/**
	 * Convert filter query -> mongoose filter and prepare base query
	 * Supports operators: gte, gt, lte, lt
	 */
	filter() {
		const reqQuery = { ...(this.req.query || {}) };

		// Remove special params from filter object
		const excludedFields = ['select', 'sort', 'keyword', 'page', 'limit'];
		excludedFields.forEach((f) => delete reqQuery[f]);

		// Convert operators, e.g. price[gte]=10  =>  { price: { $gte: 10 } }
		let queryStr = JSON.stringify(reqQuery);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (m) => `$${m}`);
		const filterObj = JSON.parse(queryStr);

		this.filterObj = filterObj;
		this.query = this.model.find(filterObj);
		return this;
	}

	/**
	 * Select specific fields: ?select=name,price -> 'name price'
	 */
	selectFields() {
		if (!this.query) this.query = this.model.find(this.filterObj);

		if (this.req.query.select) {
			const fields = this.req.query.select.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	/**
	 * Sort: ?sort=price,-createdAt -> 'price -createdAt'
	 */
	sort() {
		if (!this.query) this.query = this.model.find(this.filterObj);

		if (this.req.query.sort) {
			const sortBy = this.req.query.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	/**
	 * Text search helper. Adjust fields to your model schema as needed.
	 * Example: ?keyword=math will search name and description fields.
	 */
	search(fields = ['name', 'title', 'description']) {
		if (!this.query) this.query = this.model.find(this.filterObj);

		if (this.req.query.keyword) {
			const keyword = this.req.query.keyword;
			const or = fields.map((f) => ({ [f]: { $regex: keyword, $options: 'i' } }));
			// Merge filterObj with $or
			this.query = this.query.find({ $and: [this.filterObj, { $or: or }] });
		}
		return this;
	}

	/**
	 * Apply pagination based on ?page & ?limit
	 */
	paginate() {
		if (!this.query) this.query = this.model.find(this.filterObj);

		const page = Math.max(parseInt(this.req.query.page, 10) || 1, 1);
		const limit = this.req.query.limit
			? Math.max(parseInt(this.req.query.limit, 10), 1)
			: undefined;

		if (limit) {
			const skip = (page - 1) * limit;
			this.query = this.query.skip(skip).limit(limit);
		}
		return this;
	}
}
