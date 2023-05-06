// function to send error response to client
const sendError = (err, res) => {
	// log error stack trace for 500 errors
	if (err.statusCode === 500) {
		console.error("Error: ", err.message);
		console.error("Stack trace: ", err.stack);
	}

	// construct error response object with message and stack trace
	const response = {
		status: "error",
		message: err.message,
	};
	response.stack = err.stack;

	// send error response to client with appropriate status code
	res.status(err.statusCode).json(response);
};

// function to handle cast error from invalid ID
const handleCastErrorDB = (err) => {
	err.statusCode = 400;
	err.message = "Invalid ID";
	return err;
};

// function to handle duplicate fields error from duplicate values of unique fields
const handleDuplicateFieldsDB = (err) => {
	err.statusCode = 400;
	const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
	err.message = `Duplicate field value: ${value}`;
	return err;
};

// function to handle validation error from invalid input data
const handleValidationErrorDB = (err) => {
	err.statusCode = 400;
	const errors = Object.values(err.errors).map((el) => el.message);
	err.message = `Invalid input data. ${errors.join(". ")}`;
	return err;
};

// function to handle token expired error from expired authentication tokens
const handleTokenExpiredError = (err) => {
	err.statusCode = 403;
	err.message = "Your token has expired. Please log in again.";
	return err;
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	// Handle specific error types
	if (err.name === "CastError") err = handleCastErrorDB(err);
	if (err.code === 11000) err = handleDuplicateFieldsDB(err);
	if (err.name === "ValidationError") err = handleValidationErrorDB(err);
	if (err.name === "TokenExpiredError") err = handleTokenExpiredError(err);

	sendError(err, res);
};
