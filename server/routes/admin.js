const router = require("express").Router();

// controllers
const adminController = require("../controllers/admin");
const movieController = require("../controllers/movie");
const { addNewShow, updateShowDetails, deleteShow } = require("../controllers/show");

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

// get all deleted movies for show form select option
router.get(
	"/deleted-movies",
	authToken,
	authorizeRole(1),
	movieController.getAllDeletedMovies
);

// update movies data
router.put(
	"/movies/:movieId",
	authToken,
	authorizeRole(1),
	movieController.updateMovie
);

// delete movie
router.delete(
	"/movies/:movieId",
	authToken,
	authorizeRole(1),
	movieController.deleteMovie
);

// add new Screen
router.post(
	"/screens",
	authToken,
	authorizeRole(1),
	adminController.addScreen
);

// delete Screen
router.delete(
	"/screens/:id",
	authToken,
	authorizeRole(1),
	adminController.deleteScreen
);

// update Screen
router.put(
	"/screens/:id",
	authToken,
	authorizeRole(1),
	adminController.updateScreen
);

// get all Screens
router.get(
	"/screens",
	authToken,
	authorizeRole(1),
	adminController.getScreens
);

// add new show
router.post("/show", authToken, authorizeRole(1), addNewShow);

// update show
router.patch("/show/:showId", authToken, authorizeRole(1), updateShowDetails);

//delete show
router.delete(
	"/show/:showId",
	authToken,
	authorizeRole(1),
	deleteShow
);

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

//delete a feedback
router.delete(
	"/feedback/:feedBackId",
	authToken,
	authorizeRole(1),
	adminController.deleteFeedback
);

module.exports = router;
