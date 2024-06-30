const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowerCase: true,
		validate: [validator.isEmail, "please provide a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter your passwor"],
		minLenght: [8, "password should be atleast 8 digits"],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your passwor"],
		validate: {
			validator: function (ele) {
				// will work only on create and save
				return ele === this.password;
			},
			message: "passwords are not the same",
		},
	},
	photo: {
		type: String,
		default: "default.jpg",
	},
	role: {
		type: String,
		enum: ["user", "admin", "manager"],
		default: "user",
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // if the password is not modified.. exit

	this.password = await bcrypt.hash(this.password, 10);
	this.passwordConfirm = undefined; // will delete the passConfirm field
	next();
});

userSchema.pre(/^find/, function (next) {
	// regular exepresion means anything starting with find
	this.find({ active: { $ne: false } }); // this points to the current query
	next();
});

// the model middleware can be accsessed from anywhare
userSchema.methods.correctPass = async function (userPass, dbPass) {
	return await bcrypt.compare(dbPass, userPass); // the compare returns true or false
};

module.exports = mongoose.model("User", userSchema);
