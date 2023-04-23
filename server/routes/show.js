const router = require("express").Router();

// controllers
const { getShowByMovie, getShowSeatsDetails } = require("../controllers/show");

// auth middleware
const { authToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authorizer");

// get show seats availability
router.get("/seats/:showId", authToken, authorizeRole(0), getShowSeatsDetails);

// get show list by movie id
router.get("/:movieId", authToken, authorizeRole(0), getShowByMovie);

module.exports = router;
