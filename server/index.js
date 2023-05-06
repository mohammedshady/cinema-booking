require("dotenv").config();
require("./utils/db").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");

const app = express();

// middleware to parse JSON in request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware for cookies
app.use(cookieParser());

// middleware for file uploads
app.use(fileUpload());

// serve the frontend static files
const buildPath = path.normalize(path.join(__dirname, "../client/dist"));
app.use(express.static(buildPath));

// serve uploaded images
app.use(express.static(path.join(__dirname, "uploads")));

// log HTTP requests to the console
app.use(morgan("dev"));

// routes
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);

// serve frontend
app.get("*", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

// error handling middleware
app.use(errorHandler);

// start the server
app.listen(process.env.PORT, () =>
	console.log(`App is running on port: ${process.env.PORT}`)
);
