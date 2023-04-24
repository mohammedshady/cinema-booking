const router = require("express").Router();

// controllers
const userController = require("../controllers/user");
const { bookShow } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");

// sign up
router.post("/signup", userController.signUp);

// login
router.post("/login", userController.logIn);

// logout
router.get("/logout", userController.logout);

// load user
router.get("/load", userController.loadUser);

// book show
router.post("/bookShow", authToken, bookShow);

// give feedback
router.post("/feedback", authToken, userController.giveFeedback);

// view my bookings
router.get("/bookings", authToken, userController.getMyBookings);

//delete booking
router.delete("/bookings/:bookingId", authToken, userController.deleteBooking);

// reset password
router.post("/resetPassword", userController.resetPassword);

module.exports = router;
