const multer = require("multer");
const sharp = require("sharp"); // for image prossessing
const UserC = require("../models/usersModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const handlerFactory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "public/img/users");
// 	},
// 	filename: (req, file, cb) => {
// 		const ext = file.mimetype.split("/")[1];
// 		cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
// 	},
// });

const multerStorage = multer.memoryStorage(); // to make the image store as buffer.

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		// checks if the uploaded file is an image
		console.log("object here");
		cb(null, true);
	} else {
		cb(AppError.create("Not an image! Please upload only images.", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // we put the image in the req.file so we can use it in the updateMe ()
	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/users/${req.file.filename}`);
	next();
});

const filterObj = (obj, ...allowed) => {
	const filtered = {};
	Object.keys(obj).forEach((ele) => {
		if (allowed.includes(ele)) {
			filtered[ele] = obj[ele];
		}
	});
	return filtered;
};

exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

exports.getAllUsers = handlerFactory.getAll(UserC);
exports.getUser = handlerFactory.getOne(UserC);
exports.deleteUser = handlerFactory.deleteOne(UserC);
// Don't update passwords with this
exports.updateUser = handlerFactory.updateOne(UserC);

exports.updateMe = catchAsync(async (req, res, next) => {
	// create an error if the user POSTs a password data
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			AppError.create(
				"this route is not for password update. please use /updatePassword.",
				400
			)
		);
	}
	// filters out the unwanted fields names that are not allowed to be updated
	const filteredBody = filterObj(req.body, "name", "email");
	if (req.file) filteredBody.photo = req.file.filename;

	// update user document
	const user = await UserC.findByIdAndUpdate(req.user.id, filteredBody, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "success",
		user,
	});
});

exports.deleteMe = catchAsync(async (req, res, next) => {
	await UserC.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: "success",
		data: null,
	});
});
