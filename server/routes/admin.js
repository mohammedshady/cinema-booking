const router = require("express").Router();

// controllers
const adminController = require("../controllers/admin");
const movieController = require("../controllers/movie");
const { addNewShow, updateShowDetails } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// add new movie
router.post("/movies", authToken, authorizeRole(1), movieController.addMovie);

// get all movies
router.get(
	"/movies",
	authToken,
	authorizeRole(1),
	movieController.getAllMovies
);

// get all released movies for show form select option
router.get(
	"/released-movies",
	authToken,
	authorizeRole(1),
	movieController.getAllReleasedMovies
);

// delete movie
router.delete(
	"/movies/:movieId",
	authToken,
	authorizeRole(1),
	movieController.deleteMovie
);

// add new cinema hall
router.post(
	"/cinemaHall",
	authToken,
	authorizeRole(1),
	adminController.addCinemaHall
);

// delete cinema hall
router.delete(
	"/cinemaHall/:id",
	authToken,
	authorizeRole(1),
	adminController.deleteCinemaHall
);

// get all cinema hall
router.get(
	"/cinemaHall",
	authToken,
	authorizeRole(1),
	adminController.getCinemaHalls
);

// add new show
router.post("/show", authToken, authorizeRole(1), addNewShow);

// update show
router.patch("/show/:showId", authToken, authorizeRole(1), updateShowDetails);

// get all scheduled shows
router.get(
	"/shows/scheduled",
	authToken,
	authorizeRole(1),
	adminController.getScheduledShowsAndAnalytics
);

// get shows history
router.get(
	"/shows/history",
	authToken,
	authorizeRole(1),
	adminController.getShowsHistoryAndAnalytics
);

// populate show form with defaut values
router.get(
	"/shows/populate/:showId",
	authToken,
	authorizeRole(1),
	adminController.populateShowForm
);

// get details of show
router.get(
	"/shows/:showId",
	authToken,
	authorizeRole(1),
	adminController.getShowDetails
);

// view all feedbacks
router.get(
	"/feedback",
	authToken,
	authorizeRole(1),
	adminController.viewFeedback
);

module.exports = router;
