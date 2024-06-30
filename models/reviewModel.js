const mongoose = require("mongoose");

const tourM = require("./toursModel");
var reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review is required"],
    },
    rating: {
      type: Number,
      default: 4.5,
      max: [5, "rating must be less than or equal 5"],
      min: [1, "rating must be more than or equal 1"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //     path: "tour",
  //     select: "name summary",
  // }).populate({
  //     path: "user",
  //     select: "name photo",
  // });

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log("stats :>> ", stats);

  if (stats.length > 0) {
    await tourM.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await tourM.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRating(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre("findOneAndDelete", async function (next) {
  const rev = await this.findOne().clone();
  if (rev) await rev.constructor.calcAverageRating(rev.tour);
  next();
});

reviewSchema.post("findOneAndUpdate", async function () {
  // await this.findOne(); does NOT work here, query has already executed
  const rev = await this.findOne().clone();
  console.log("this.rev :>> ", rev);
  await rev.constructor.calcAverageRating(rev.tour);
});

module.exports = mongoose.model("Review", reviewSchema);
