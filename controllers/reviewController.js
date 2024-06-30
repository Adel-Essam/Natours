const reviewM = require("../models/reviewModel");
const handlerFactory = require("./handlerFactory");

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.getAllReviews = handlerFactory.getAll(reviewM);
exports.getReview = handlerFactory.getOne(reviewM);
exports.createReview = handlerFactory.createOne(reviewM);
exports.deleteReview = handlerFactory.deleteOne(reviewM);
exports.updateReview = handlerFactory.updateOne(reviewM);
