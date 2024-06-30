const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("./../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/* The `exports.deleteOne` function is responsible for deleting a document from the specified model
based on the ID provided in the request parameters. Here's a breakdown of what it does: */
exports.deleteOne = (model) =>
	catchAsync(async (req, res, next) => {
		const doc = await model.findByIdAndDelete(req.params.id);
		if (!doc) {
			return next(AppError.create("No document found with that ID", 404));
		}
		res.status(204).json({
			status: "success",
			data: null,
		});
	});

/* The `exports.updateOne` function is responsible for updating a document in the specified model based
on the provided ID. Here's a breakdown of what it does: */
exports.updateOne = (model) =>
	catchAsync(async (req, res, next) => {
		const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc)
			return next(AppError.create("No document found with that ID", 404));
		res.status(200).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

/* The `exports.createOne` function is responsible for creating a new document in the specified model.
Here's a breakdown of what it does: */
exports.createOne = (model) =>
	catchAsync(async (req, res, next) => {
		const doc = await model.create(req.body);
		res.status(201).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

/* This `exports.getOne` function is responsible for fetching a single document from a specified model
based on the provided ID. Here's a breakdown of what it does: */
exports.getOne = (model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = model.findById(req.params.id).select("-__v");
		if (popOptions) query = query.populate(popOptions);
		const doc = await query;
		if (!doc) return next(AppError.create("wrong ID", 404));
		res.status(200).json({
			status: "success",
			data: {
				doc,
			},
		});
	});

/* This `exports.getAll` function is responsible for fetching all documents from a specified model
based on certain filters and query parameters. Here's a breakdown of what it does: */
exports.getAll = (model) =>
	catchAsync(async (req, res, next) => {
		// to allow nested GET reviews on tour
		let filter = {};
		if (req.params.tourId) filter = { tour: req.params.tourId };

		const features = new ApiFeatures(model.find(filter), req.query)
			.filter()
			.sort()
			.limit()
			.paginate();
		const docs = await features.query;
		res.status(200).json({
			status: "success",
			data: {
				results: docs.length,
				docs,
			},
		});
	});
