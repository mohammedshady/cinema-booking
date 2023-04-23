const router = require("express").Router();

// controllers
const userController = require("../controllers/user");
const { bookShow } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// sign up
router.post("/signup", userController.signUp);

// login
router.post("/login", userController.logIn);

// logout
router.get("/logout", authToken, userController.logout);

// load user
router.get("/load", authToken, userController.loadUser);

// book show
router.post("/bookShow", authToken, authorizeRole(0), bookShow);

// give feedback
router.post(
	"/feedback",
	authToken,
	authorizeRole(0),
	userController.giveFeedback
);

// view my bookings
router.get(
	"/bookings",
	authToken,
	authorizeRole(0),
	userController.getMyBookings
);

// forgot password
router.post("/forgotPassword", userController.forgotPassword);

// reset password
router.post("/resetPassword/:userId/:token", userController.resetPassword);

module.exports = router;
