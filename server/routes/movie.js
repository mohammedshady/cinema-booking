const router = require("express").Router();

// controllers
const { userGetAllMovies, getMovieById } = require("../controllers/movie");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// user get all movies
router.get("/", authToken, authorizeRole(0), userGetAllMovies);

// user get movie details
router.get("/:movieId", authToken, authorizeRole(0), getMovieById);

module.exports = router;
