const router = require("express").Router();
const { authToken } = require("../middlewares/authenticateToken");
const {
	loadUser,
	signUp,
	logIn,
	logOut,
	resetPassword,
} = require("../controllers/user");
const { userGetAllMovies, userGetMovieById } = require("../controllers/movie");
const { getShowByMovieId, getShowDetails } = require("../controllers/show");
const {
	userGetBookings,
	addBooking,
	deleteBooking,
} = require("../controllers/booking");
const { addFeedback } = require("../controllers/feedback");

// User routes
router.get("/load", loadUser);
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/resetPassword", resetPassword);

// Movies routes
router.get("/movies/", userGetAllMovies);
router.get("/movies/:id", userGetMovieById);

// Shows routes
router.get("/shows/:id", authToken, getShowByMovieId);
router.get("/shows/seats/:id", authToken, getShowDetails);

// Booking routes
router.get("/bookings", authToken, userGetBookings);
router.post("/addBooking", authToken, addBooking);
router.delete("/bookings/:id", authToken, deleteBooking);

// Feedback routes
router.post("/feedback", authToken, addFeedback);

module.exports = router;
