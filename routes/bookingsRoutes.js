const express = require("express");
const bookingController = require("./../controllers/bookingController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get(
	"/checkout-session/:tourId",
	authController.protect,
	bookingController.getCheckoutSession
);

router.use(authController.restrictTo("admin", "lead-guid"));

router
	.route("/")
	.get(bookingController.getAllbookings)
	.post(bookingController.createbooking);

router
	.route("/:id")
	.get(bookingController.getbooking)
	.post(bookingController.updatebooking)
	.delete(bookingController.deletebooking);

module.exports = router;
