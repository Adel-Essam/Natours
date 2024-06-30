const UserC = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Email = require("../utils/email");
// const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); // turns a fn into promise fn

const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET, {
		expiresIn: "1d",
	});
};

const sendTokenCookie = (token, res) => {
	res.cookie("jwt", token, {
		expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		secure: true,
		httpOnly: true, //* prevent access to the cookie [in producion]
	});
};

const signUp = catchAsync(async (req, res, next) => {
	const newUser = await UserC.create({
		// we do this so no one can add any other data to the database
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		photo: req.body.photo,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role,
	});

	const url = `${req.protocol}://${req.get("host")}/me`;
	await new Email(newUser, url).sendWelcome();
	// await sendEmail({
	// 	email: newUser.email,
	// 	subject: "Hello this is a test",
	// 	message: "hello from natours admin this is me saying hello.",
	// });

	const token = createToken(newUser._id);
	newUser.password = undefined;

	sendTokenCookie(token, res);
	res.status(201).json({
		status: "success",
		token,
		data: {
			user: newUser,
		},
	});
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(AppError.create("please provide email and password", 400));
	}

	const user = await UserC.findOne({ email }).select("+password");
	if (!user || !(await user.correctPass(user.password, password))) {
		return next(AppError.create("wrong email or password", 401));
	}
	const token = createToken(user._id);

	sendTokenCookie(token, res);
	res.status(200).json({
		status: "success",
		token,
		user,
	});
});

const logout = (req, res) => {
	res.cookie("jwt", "loggedout", {
		expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
		httpOnly: true,
	});
	res.status(200).json({ status: "success" });
};

const protect = catchAsync(async (req, res, next) => {
	// 1) getting token and check if it's there
	const auth = req.headers["Authorization"] || req.headers["authorization"];
	let token;
	if (auth && auth.startsWith("Bearer")) {
		token = auth.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token || token === "null") {
		return next(
			AppError.create("You Are not logged in! Please log in to get access", 401)
		);
	}

	// 2) Verification token
	const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
	const currentUser = await UserC.findById(decoded.id);
	if (!currentUser) {
		return next(
			AppError.create("The user with this token no longer exist.", 401)
		);
	}
	req.user = currentUser;
	res.locals.user = currentUser; // this is passing a var called user to the template (like using render)

	next(); // grant access to the protected route
});

// Only for rendred pages, NO ERRORS
const isLoggedIn = async (req, res, next) => {
	try {
		// 1) verify token
		if (req.cookies.jwt) {
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.SECRET
			);

			// 2) check if user still exists
			const currentUser = await UserC.findById(decoded.id);

			if (!currentUser) {
				return next();
			}

			// THERE IS A LOGGED IN USER
			res.locals.user = currentUser; // this is passing a var called user to the template (like using render)
		}
		next();
	} catch (err) {
		return next();
	}
};

const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			let roleMod;
			if (roles.length > 1) {
				roleMod = roles.join(" or ");
			} else {
				roleMod = roles[0];
			}
			return next(
				AppError.create(`You must be ${roleMod} to perform this action`, 403)
			);
		}
		next();
	};
};

const updatePassword = catchAsync(async (req, res, next) => {
	const user = await UserC.findById(req.user.id).select("+password");
	if (!(await user.correctPass(user.password, req.body.currentPassword))) {
		return next(AppError.create("current password is wrong", 401));
	}
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	await user.save();

	const token = createToken(user.id);
	sendTokenCookie(token, res);

	res.status(201).json({
		status: "success",
		token,
	});
});

module.exports = {
	signUp,
	login,
	protect,
	restrictTo,
	updatePassword,
	isLoggedIn,
	logout,
};
