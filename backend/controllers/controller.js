import slugify from 'slugify';
import QueryManipulator from '../utils/QueryManipulator.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

// getAll: generic fetch that supports filter/sort/select/search/paginate
export const getAll = (Model) =>
	asyncErrorHandler(async (req, res) => {
		// Build query (without pagination) so we can count totalDocs for given filters
		const qm = new QueryManipulator(req, Model).filter().selectFields().search().sort();

		// Count documents matching filters (before pagination)
		const filterObj = qm.filterObj || {};
		const totalDocs = await Model.countDocuments(filterObj);

		// Apply pagination then execute the query
		qm.paginate();
		const docs = await qm.query;

		const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : docs ? docs.length : 0;
		const totalPages = limit ? Math.ceil(totalDocs / limit) : 1;

		res.status(200).json({
			status: 'success',
			count: docs.length,
			pagination: { totalDocs, page, limit, totalPages },
			data: { docs },
		});
	});

export const createOne = (model) =>
	asyncErrorHandler(async (req, res) => {
		if (req.body.name) req.body.slug = slugify(req.body.name);

		const newDoc = await model.create(req.body);

		res.status(201).json({
			status: 'success',
			data: {
				newDoc,
			},
		});
	});

export const getOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		const doc = await model.findById(req.params.id);

		if (!doc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(200).json({
			status: 'success',
			data: {
				doc,
			},
		});
	});

export const updateOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		if (req.body.name) req.body.slug = slugify(req.body.name);

		const updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedDoc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(200).json({
			status: 'success',
			data: {
				updatedDoc,
			},
		});
	});

export const deleteOne = (model, modelName = 'Document') =>
	asyncErrorHandler(async (req, res) => {
		const deletedDoc = await model.findByIdAndDelete(req.params.id);

		if (!deletedDoc) {
			const translatedModelName = req.__(`models.${modelName}`);
			throw new CustomError(
				req.__('generic.not_found', { model_name: translatedModelName }),
				404,
			);
		}

		res.status(204).send();
	});
