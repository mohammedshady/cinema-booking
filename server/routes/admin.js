const router = require("express").Router();

// controllers
const adminController = require("../controllers/admin");
const movieController = require("../controllers/movie");
const {
	addNewShow,
	updateShowDetails,
	deleteShow,
} = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// add new movie
router.post("/movies", authToken, authorizeRole(1), movieController.addMovie);

// get all movies
router.get("/", authToken, authorizeRole(1), adminController.getAllData);
router.get(
	"/movies",
	authToken,
	authorizeRole(1),
	movieController.getAllMovies
);

// populate movie form with defaut values
router.get(
	"/movies/populate/:movieId",
	authToken,
	authorizeRole(1),
	adminController.populateMovieForm
);

// get all released movies for show form select option
router.get(
	"/shows/populate",
	authToken,
	authorizeRole(1),
	adminController.getDetailsForShowForm
);

// update movies data
router.patch(
	"/movies/:movieId",
	authToken,
	authorizeRole(1),
	movieController.updateMovie
);

// delete movie
router.delete(
	"/movies",
	authToken,
	authorizeRole(1),
	movieController.deleteMovie
);

// add new Screen
router.post("/screens", authToken, authorizeRole(1), adminController.addScreen);

// delete Screen
router.delete(
	"/screens",
	authToken,
	authorizeRole(1),
	adminController.deleteScreen
);

// update Screen
router.patch(
	"/screens/:screenId",
	authToken,
	authorizeRole(1),
	adminController.updateScreen
);

// get all Screens
router.get("/screens", authToken, authorizeRole(1), adminController.getScreens);

// populate screen form with defaut values
router.get(
	"/screens/populate/:screenId",
	authToken,
	authorizeRole(1),
	adminController.populateScreenForm
);

// add new show
router.post("/show", authToken, authorizeRole(1), addNewShow);

// update show
router.patch("/show/:showId", authToken, authorizeRole(1), updateShowDetails);

//delete show
router.delete("/show", authToken, authorizeRole(1), deleteShow);

// get all scheduled shows
router.get(
	"/shows/scheduled",
	authToken,
	authorizeRole(1),
	adminController.getScheduledShowsAndAnalytics
);

// populate show form with defaut values
router.get(
	"/shows/populate/:showId",
	authToken,
	authorizeRole(1),
	adminController.populateShowForm
);

// view all feedbacks
router.get(
	"/feedback",
	authToken,
	authorizeRole(1),
	adminController.viewFeedback
);

//delete a feedback
router.delete(
	"/feedback",
	authToken,
	authorizeRole(1),
	adminController.deleteFeedback
);

// view all bookings
router.get(
	"/bookings",
	authToken,
	authorizeRole(1),
	adminController.viewBookings
);

//delete bookings
router.delete(
	"/bookings",
	authToken,
	authorizeRole(1),
	adminController.deleteBookings
);

// view all users
router.get(
	"/users",
	authToken,
	authorizeRole(1),
	adminController.viewUsers
);

//delete users
router.delete(
	"/users",
	authToken,
	authorizeRole(1),
	adminController.deleteUsers
);

module.exports = router;
