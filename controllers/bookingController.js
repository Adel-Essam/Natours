const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const tourM = require("../models/toursModel");
const bookingM = require("../models/booingsModel");
const catchAsync = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	// 1) Get the currently booked tour
	const tour = await tourM.findById({ _id: req.params.tourId });

	// 2) Create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		success_url: `${req.protocol}://${req.get("host")}/my-tours/?tour=${
			req.params.tourId
		}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		mode: "payment",
		line_items: [
			{
				quantity: 1,
				price_data: {
					unit_amount: tour.price * 100,
					currency: "usd",
					product_data: {
						name: `${tour.name} Tour`,
						description: tour.summary,
						images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
					},
				},
			},
		],
	});

	// 3) Create session as response
	res.status(200).json({
		status: "success",
		session,
	});
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
	// This is only temporary, because it's unsecure: every one can make bookings without paying
	const { tour, user, price } = req.query;

	if (!tour && !user && !price) return next();
	await bookingM.create({
		tour,
		user,
		price,
	});
	res.redirect(req.originalUrl.split("?")[0]);
});

exports.getAllbookings = handlerFactory.getAll(bookingM);
exports.getbooking = handlerFactory.getOne(bookingM);
exports.createbooking = handlerFactory.createOne(bookingM);
exports.deletebooking = handlerFactory.deleteOne(bookingM);
exports.updatebooking = handlerFactory.updateOne(bookingM);
