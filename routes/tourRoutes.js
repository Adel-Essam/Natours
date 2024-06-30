const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router
//     .route("/:tourId/reviews")
//     .post(
//         authController.protect,
//         authController.restrictTo("user"),
//         reviewController.createReview
//     );

router.use("/:tourId/reviews", reviewRouter);

// this is an alias of a route
router
	.route("/hot-offers")
	.get(tourController.getHotOffers, tourController.getAllTours);

router.route("/tours-stats").get(tourController.getToursStats);

router
	.route("/tours-within/:distance/center/:latlng/:unit")
	.get(tourController.getToursWithin);

router.route("/distances/:latlng/:unit").get(tourController.getDistances);

router
	.route("/")
	.get(tourController.getAllTours)
	.post(
		authController.protect,
		authController.restrictTo("admin", "manager"),
		tourController.createTour
	);

router
	.route("/:id")
	.get(tourController.getTour)
	.patch(
		authController.protect,
		authController.restrictTo("admin", "manager"),
		tourController.uploadTourImages,
		tourController.resizeTourImages,
		tourController.updateTour
	)
	.delete(
		authController.protect,
		authController.restrictTo("admin", "manager"),
		tourController.deleteTour
	);

module.exports = router;
