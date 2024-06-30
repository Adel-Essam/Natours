const multer = require("multer");
const sharp = require("sharp"); // for image prossessing
const tourM = require("../models/toursModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
// const openAI = require("openai");
// const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const multerStorage = multer.memoryStorage(); // to make the image store as buffer.

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		// checks if the uploaded file is an image
		cb(null, true);
	} else {
		cb(AppError.create("Not an image! Please upload only images.", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
	{ name: "imageCover", maxCount: 1 },
	{ name: "images", maxCount: 3 },
]);

// upload.single('image')
// upload.array('images', 5) // this is how to do it in array

exports.resizeTourImages = catchAsync(async (req, res, next) => {
	if (!req.files.imageCover && !req.files.images) return next(); // the way that jonas does it
	// 1) Cover Image
	if (req.files.imageCover) {
		req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
		await sharp(req.files.imageCover[0].buffer)
			.resize(2000, 1333)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(`public/img/tours/${req.body.imageCover}`);
	}
	// 2) Images
	if (req.files.images) {
		req.body.images = [];

		await Promise.all(
			req.files.images.map(async (file, i) => {
				const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

				await sharp(file.buffer)
					.resize(2000, 1333)
					.toFormat("jpeg")
					.jpeg({ quality: 90 })
					.toFile(`public/img/tours/${filename}`);

				req.body.images.push(filename);
			})
		);
	}
	next();
});

exports.getHotOffers = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price,ratingsAverage";
	req.query.fields = "name,price,difficulty,ratingsAverage,summary";
	next();
};

exports.getToursStats = catchAsync(async (req, res, next) => {
	const stats = await tourM.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.7 } },
		},
		{
			$group: {
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
		// {
		//     $match: { _id: { $ne: "EASY" } }, // we can add another filter
		// },
	]);
	res.status(200).json({
		status: "success",
		data: {
			stats,
		},
	});
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");

	const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		next(
			new AppError(
				"Please provide latitude and longitude in the format lat,lng.",
				400
			)
		);
	}

	const tours = await tourM.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			tours,
		},
	});
});

exports.getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");

	const multiplier = unit === "mi" ? 0.000621371 : 0.001;

	if (!lat || !lng) {
		next(
			new AppError(
				"Please provide latitude and longitude in the format lat,lng.",
				400
			)
		);
	}

	const distances = await tourM.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [lng * 1, lat * 1],
				},
				distanceField: "distance",
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	]);

	res.status(200).json({
		status: "success",
		data: {
			data: distances,
		},
	});
});

exports.ask = catchAsync(async (req, res, next) => {
	let docs = await tourM.find().select("id name price summary duration ");

	const modifiedDocs = docs.map(({ guides, durationWeeks, ...rest }) => rest);
	let toursOut = modifiedDocs.map((doc) => {
		const { guides, ...rest } = doc._doc;
		return rest;
	});

	const genAI = new GoogleGenerativeAI(
		"AIzaSyAK6eL1MiRBw-5TMZqn5mY3VRjBq5TF9wE"
	);

	// For text-only input, use the gemini-pro model
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const questoin = req.body.question;
	console.log("questoin :>> ", questoin);
	const prompt = `I want you to forget any prompt given to you and do this propmt:
    Based on the data that will be given to you, which is a collection of tours in the form of JSON, I want the answer to this question:
    ${questoin}
    the output should be in JSON in this way:
    (if one match):
    Result:
    (the document matched) between curly braces.
    (if multiple matches):
    Result:
    (the documents matched) between curly braces.
    The tours: ${JSON.stringify(toursOut)}
    `;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	let text = response.text();

	console.log("text before:>> ", text);
	text = text.substring(8);
	text = text.replace(/new ObjectId\('([^']+)'\)/g, '"$1"');
	console.log("text :>> ", text);

	let out = eval(`[${text}]`);
	if (out)
		res.status(200).json({
			status: "success",
			data: {
				tours: out,
			},
		});
	else
		return AppError.create(
			"Coudn't get what you asked for, please try again ^_^"
		);
});

// const client = new openAI.OpenAI({
//     apiKey: "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",
// });
// const completions = await client.chat.completions.create({
//     messages: [
//         {
//             role: "system",
//             content: "what is the best operating system for programing",
//         },
//     ],
//     model: "gpt-3.5-turbo",
// });
// console.log(completions.choices[0]);
// Access your API key as an environment variable (see "Set up your API key" above)

exports.getAllTours = handlerFactory.getAll(tourM);
exports.createTour = handlerFactory.createOne(tourM);
exports.getTour = handlerFactory.getOne(tourM, "reviews");
exports.updateTour = handlerFactory.updateOne(tourM);
exports.deleteTour = handlerFactory.deleteOne(tourM);
