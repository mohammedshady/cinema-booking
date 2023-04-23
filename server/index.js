require("dotenv").config();
require("./utils/db").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const showRoute = require("./routes/show");
const movieRoute = require("./routes/movie");

const app = express();

// middlewares to parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// accept cross origin request
app.use(cors());

// cookies & file upload middlewares
app.use(cookieParser());
app.use(fileUpload());

// middleware for access frontend
const buildPath = path.normalize(path.join(__dirname, "../client/dist"));
app.use(express.static(buildPath));
app.use(express.static(path.join(__dirname, "uploads")));
console.log(path.join(__dirname, "uploads"));

// logger
app.use(morgan("dev"));

/**
 * application routes
 */

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/shows", showRoute);
app.use("/api/movies", movieRoute);

// home route
app.get("/api", (req, res) => {
	res.status(200).json({
		status: "success",
		message: "Welcome to movie buzz backend",
	});
});

// serve frontend
app.get("/", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

// error handling
app.use(globalErrorHandler);

app.listen(process.env.PORT, () =>
	console.log(`App is running on port:${process.env.PORT}`)
);
