const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewsController.getOverview);

router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);

router.get("/login", authController.isLoggedIn, viewsController.login);
router.get("/me", authController.protect, viewsController.getAccount);
router.get(
	"/my-tours",
	authController.protect,
	bookingController.createBookingCheckout,
	viewsController.getMyTours
);
router.post(
	"/submit-user-data",
	authController.protect,
	viewsController.updateUserDAta
);

module.exports = router;
