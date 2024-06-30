const tourM = require("../models/toursModel");
const usersModel = require("../models/usersModel");
const bookingM = require("../models/booingsModel");

const AppError = require("../utils/AppError");

const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
	const tours = await tourM.find();
	res
		.status(200)
		.setHeader(
			"Content-Security-Policy",
			"script-src 'self' https://js.stripe.com;"
		)
		.render("overview", {
			title: "All Tours",
			tours,
		});
});

exports.getTour = catchAsync(async (req, res, next) => {
	// console.log("req.params :>> ", req.params);
	const tour = await tourM.findOne({ slug: req.params.slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});
	if (!tour)
		return next(AppError.create("There is no tour with that name.", 404));
	res
		.status(200)
		.setHeader(
			"Content-Security-Policy",
			"script-src 'self' https://api.mapbox.com https://js.stripe.com; worker-src 'self' blob:"
		)
		.render("tour", {
			title: `${tour.name} tour`,
			tour,
		});
});

exports.login = catchAsync(async (req, res, next) => {
	res
		.status(200)
		.setHeader(
			"Content-Security-Policy",
			"script-src 'self' https://cdn.jsdelivr.net https://js.stripe.com;"
		)
		.render("login", {
			title: "Login",
			status: "success",
		});
});

exports.getAccount = catchAsync(async (req, res, next) => {
	res
		.status(200)
		.setHeader(
			"Content-Security-Policy",
			"script-src 'self' https://cdn.jsdelivr.net https://js.stripe.com;"
		)
		.render("account", {
			title: "Your account",
		});
});

exports.updateUserDAta = catchAsync(async (req, res, next) => {
	const updatedUser = await usersModel.findByIdAndUpdate(
		req.user.id,
		{
			name: req.body.name,
			email: req.body.email,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(200).render("account", {
		title: "Your account",
		user: updatedUser,
	});
});

exports.getMyTours = catchAsync(async (req, res, next) => {
	// 1) Find all bookings
	const bookings = await bookingM.find({ user: req.user.id });

	// 2) Find tours with the returned IDs
	const tourIDs = bookings.map((el) => el.tour);
	const tours = await tourM.find({ _id: { $in: tourIDs } });

	res
		.status(200)
		.setHeader(
			"Content-Security-Policy",
			"script-src 'self' https://js.stripe.com;"
		)
		.render("overview", {
			title: "My Tours",
			tours,
		});
});
