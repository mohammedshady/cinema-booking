const NODE_ENV = process.env.NODE_ENV || "development";

const sendError = (err, res) => {
	// Log error message and stack trace for operational errors
	if (err.statusCode === 500) {
		console.error("Error:", err.message);
		console.error("Stack trace:", err.stack);
	}

	const response = {
		status: "error",
		message: err.message,
	};

	// Add stack trace to response in development mode
	if (NODE_ENV === "development") {
		response.stack = err.stack;
	}

	res.status(err.statusCode).json(response);
};

const handleCastErrorDB = (err) => {
	err.statusCode = 400;
	err.message = "Invalid ID";
	return err;
};

const handleDuplicateFieldsDB = (err) => {
	err.statusCode = 400;
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	err.message = `Duplicate field value: ${value}`;
	return err;
};

const handleValidationErrorDB = (err) => {
	err.statusCode = 400;
	const errors = Object.values(err.errors).map((el) => el.message);
	err.message = `Invalid input data. ${errors.join(". ")}`;
	return err;
};

const handleTokenExpiredError = (err) => {
	err.statusCode = 403;
	err.message = "Your token has expired. Please log in again.";
	return err;
};

module.exports = (err, req, res, next) => {
	// Set default status code to 500 if not already set
	err.statusCode = err.statusCode || 500;

	// Handle specific error types
	if (err.name === "CastError") err = handleCastErrorDB(err);
	if (err.code === 11000) err = handleDuplicateFieldsDB(err);
	if (err.name === "ValidationError") err = handleValidationErrorDB(err);
	if (err.name === "TokenExpiredError") err = handleTokenExpiredError(err);

	sendError(err, res);
};
