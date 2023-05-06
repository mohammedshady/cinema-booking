const CustomError = require("../utils/customError");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authToken = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token;

	// if token unavailable send login again message
	if (!token) return next(new CustomError("Please log in again.", 401));

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// token invalid or expired
	if (!decoded)
		return next(
			new CustomError("Your session has expired. Please log in again.", 401)
		);

	let user = await User.findOne({ _id: decoded.id }).select("+role");

	if (!user) return next(new CustomError("Your session has expired. Please log in again.", 401));

	req.user = user;

	next();
});
