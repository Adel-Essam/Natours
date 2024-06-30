const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// this works like app.use and affected all the upcoming middleware
// so all the next routes will be protected
router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser);
router.patch(
	"/updateMe",
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

router.patch("/updatePassword", authController.updatePassword);

router.use(authController.restrictTo("admin", "manager"));
router.route("/").get(userController.getAllUsers);

router
	.route("/:id")
	.get(authController.restrictTo("admin", "manager"), userController.getUser)
	.patch(userController.updateUser)
	.delete(authController.restrictTo("manager"), userController.deleteUser);

module.exports = router;
