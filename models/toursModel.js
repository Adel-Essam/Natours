const mongoose = require("mongoose");
const slugify = require("slugify");

// const validator = require("validator");
// const UserM = require("./usersSchema");

var tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			unique: true,
			trim: true,
			minLength: [10, "the minimum length is 10"],
			maxLength: [20, "the maximum length is 20"],
			// validate: [
			//     validator.isAlphanumeric,
			//     "the name must only have characters and numbers",
			// ],
		},
		slug: String,
		price: {
			type: Number,
			required: [true, "price is required"],
		},
		duration: {
			type: Number,
			required: [true, "duration is required"],
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			max: [5, "rating must be less than or equal 5"],
			min: [1, "rating must be more than or equal 1"],
			set: (value) => Math.round(value * 10) / 10, // 4.6666=> 46.666=> 47 => 4.7
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		difficulty: {
			type: String,
			required: [true, "difficulty is required"],
			enum: {
				// the enum allows only the values we want
				values: ["easy", "medium", "difficult"],
				message: "difficulty is either: easy, medium or difficult",
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "summary is required"],
		},
		description: {
			type: String,
			trim: true,
		},
		maxGroupSize: {
			type: Number,
			required: [true, "group size is required"],
		},
		imageCover: {
			type: String,
			required: [true, "image cover is required"],
		},
		priceDiscount: Number,
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false, // this will hide this field in the response
		},
		startDates: [Date],
		startLocation: {
			// GeoJSON
			type: {
				// we do it this way bcz its embedded
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// INDEXES
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: "2dsphere" });

// a virtual func that returns the duration/7  but we can't use queries on the field
tourSchema.virtual("durationWeeks").get(function () {
	return this.duration / 7;
});

// virtual population
tourSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

// MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v",
	});
	next();
});

tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});
// this middleware gets the users by the IDs in the tour when we create it
// and save them in the tour model [embedding]
// tourSchema.pre("save", async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await UserM.findById(id)
//     );
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });
// // the "/^find/" means that this middleware will work with any method that starts with "find"
// // and it is called a regular expression
// // tourSchema.pre("find", function (next) {
// tourSchema.pre(/^find/, function (next) {
//     this.find({ difficulty: { $ne: "easy" } }); // this will exclude the results with 'easy'
//     next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//     // the post middleware has the access to the responded documents
//     let len = JSON.stringify(docs).split("},").length; // sebaka code (;
//     console.log(len);
//     next();
// });

//Export the model
module.exports = mongoose.model("Tour", tourSchema);
