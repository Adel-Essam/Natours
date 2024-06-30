const mongoose = require("mongoose");

var bookingScema = new mongoose.Schema({
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: "Tour",
		required: ["true", "Booking must belong to a Tour!"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Booking must belong to a User!"],
	},
	price: {
		type: Number,
		required: [true, "Booking must have a price."],
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	paid: {
		type: Boolean,
		default: true,
	},
});

bookingScema.pre(/^find/, function (next) {
	this.populate("user").populate({
		path: "tour",
		select: "name",
	});
	next();
});

module.exports = mongoose.model("Booking", bookingScema);
