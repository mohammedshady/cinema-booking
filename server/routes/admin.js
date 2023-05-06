const router = require("express").Router();
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");
const { getDashboardData, getAllUsers, deleteUsers } = require("../controllers/user");
const {
	getAllMovies,
	getMovieById,
	addMovie,
	updateMovie,
	deleteMovies,
} = require("../controllers/movie");
const {
	getAllShows,
	getShowOptions,
	getShowById,
	addShow,
	updateShow,
	deleteShows,
} = require("../controllers/show");
const {
	getAllScreens,
	getScreenById,
	addScreen,
	updateScreen,
	deleteScreens,
} = require("../controllers/screen");
const { getFeedbacks, deleteFeedbacks } = require("../controllers/feedback");
const { getAllBookings, deleteBookings } = require("../controllers/booking");

// Dashboard routes
router.get("/", authToken, authorizeRole(1), getDashboardData);

// Movies routes
router.get("/movies", authToken, authorizeRole(1), getAllMovies);
router.get("/movies/populate/:id", authToken, authorizeRole(1), getMovieById);
router.post("/movies", authToken, authorizeRole(1), addMovie);
router.patch("/movies/:id", authToken, authorizeRole(1), updateMovie);
router.delete("/movies", authToken, authorizeRole(1), deleteMovies);

// Shows routes
router.get("/shows", authToken, authorizeRole(1), getAllShows);
router.get("/shows/populate", authToken, authorizeRole(1), getShowOptions);
router.get("/shows/populate/:id", authToken, authorizeRole(1), getShowById);
router.post("/show", authToken, authorizeRole(1), addShow);
router.patch("/show/:id", authToken, authorizeRole(1), updateShow);
router.delete("/show", authToken, authorizeRole(1), deleteShows);

// Screens routes
router.get("/screens", authToken, authorizeRole(1), getAllScreens);
router.get("/screens/populate/:id", authToken, authorizeRole(1), getScreenById);
router.post("/screens", authToken, authorizeRole(1), addScreen);
router.patch("/screens/:id", authToken, authorizeRole(1), updateScreen);
router.delete("/screens", authToken, authorizeRole(1), deleteScreens);

// Feedbacks routes
router.get("/feedback", authToken, authorizeRole(1), getFeedbacks);
router.delete("/feedback", authToken, authorizeRole(1), deleteFeedbacks);

// Bookings routes
router.get("/bookings", authToken, authorizeRole(1), getAllBookings);
router.delete("/bookings", authToken, authorizeRole(1), deleteBookings);

// Users routes
router.get("/users", authToken, authorizeRole(1), getAllUsers);
router.delete("/users", authToken, authorizeRole(1), deleteUsers);

module.exports = router;
