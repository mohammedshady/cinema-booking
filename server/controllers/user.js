const crypto = require("crypto");
const asyncHandler = require("../middlewares/asyncHandler");
const { cookieToken } = require("../utils/cookieToken");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

// models
const User = require("../models/user");
const Feedback = require("../models/feedback");
const Booking = require("../models/booking");
const Show = require("../models/show");

// sign up
exports.signUp = asyncHandler(async (req, res, next) => {
	// distructure data from request body
	let { name,
		email,
		mobile_no,
		birth_date,
		gender,
		password } = req.body;

	if (!email || !password) {
		return next(new CustomError("Email & password are required", 400));
	}

	let user = await User.findOne({ email });

	if (user) {
		return next(new CustomError("User already exist", 400));
	}

	// create user
	user = await User.create({
		name,
		email,
		mobileno: mobile_no,
		date_of_birth: birth_date,
		sex: gender,
		password,
	});

	// sending token in cookie
	cookieToken(user, res);
});

// login
exports.logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// check if email & password present
	if (!email || !password)
		return next(new CustomError("Email and password are required", 400));

	// getting user from DB
	const user = await User.findOne({ email }).select("+password +role");

	// if user not exist
	if (!user) {
		return next(new CustomError("Invalid credentials", 400));
	}

	const isPasswordValidate = await user.isValidatedPassword(password);

	// wrong password
	if (!isPasswordValidate) {
		return next(new CustomError("Invalid credentials", 400));
	}

	// sending token in cookie
	cookieToken(user, res);
});

// give feedback
exports.giveFeedback = asyncHandler(async (req, res, next) => {
	const { message } = req.body;

	if (!message) return next(new CustomError("Please add feedback message"));

	const feedbackData = {
		message,
		user: req.user._id,
	};

	const feedback = await Feedback.create(feedbackData);

	return res.status(201).json({
		status: "success",
		message: "feedback added",
		data: {
			feedback,
		},
	});
});

// get my bookings
exports.getMyBookings = asyncHandler(async (req, res, next) => {
	const bookings = await Booking.find(
		{ user: req.user._id },
		{ user: 0, updatedAt: 0 }
	)
		.populate({
			path: "movie",
			model: "Movie",
			select: "title images",
		})
		.sort({ createdAt: -1 });

	for (let booking of bookings) {
		if (booking.show.startTime < Date.now()) booking._doc.isExpired = true;
		else booking._doc.isExpired = false;
	}

	return res.status(200).json({
		status: "success",
		message: "booking list fetched",
		data: {
			totalBookings: bookings.length,
			bookings,
		},
	});
});

// delete a booking
exports.deleteBooking = asyncHandler(async (req, res, next) => {
	const { bookingId } = req.params;

	// check if booking exists
	const booking = await Booking.findById(bookingId);

	if (!booking) {
		return next(new CustomError("Booking not found", 400));
	}

	// check if user is authorized to delete booking
	// if (booking.user.toString() !== req.user._id.toString()) {
	// 	return next(new CustomError("unAuthorized user for deletion", 400));
	// }

	const seats = booking.seats;

	const showId = booking.show.id.toString();

	const show = await Show.findById(showId);

	if (!show) return next(new CustomError("Amongus", 400));

	for (let i = 0; i < show.seats.length; i++) {
		for (let j = 0; j < seats.length; j++) {
			if (show.seats[i].name === seats[j]) show.seats[i].available = true;
		}
	}
	show.save();

	// remove booking
	await booking.remove();

	// return success message
	res.status(200).json({
		status: "success",
		message: "Booking Deleted",
		data: {
			bookingId: bookingId,
		},
	});
});

// reset password
exports.resetPassword = async (req, res, next) => {
	console.log(req.body);
	const { email, date_of_birth, newPassword } = req.body;

	if (!email) return next(new CustomError("enter your email please", 400))

	if (!newPassword) return next(new CustomError("enter password please", 400))

	if (!date_of_birth) return next(new CustomError("enter birthdate please", 400))

	// Verify user with old password
	const user = await User.findOne({ email }).select('email date_of_birth');

	if (!user) return next(new CustomError("email doesnt exist", 400))
	console.log(user);
	if (user.date_of_birth.toISOString() !== new Date(date_of_birth).toISOString()) {

		return next(new CustomError("birthdate mismatch", 400))
	}
	user.password = newPassword;
	// Save user
	await user.save();
	// Return success message
	return res.status(200).json({ message: 'Password reset successful' });
};

// load user
exports.loadUser = asyncHandler(async (req, res, next) => {
	const token = req.cookies.token;

	// if token unavailable send null user
	if (!token)
		return res.status(200).json({
			status: "success",
			data: {
				user: null,
			},
		});

	const decode = jwt.verify(token, process.env.JWT_SECRET);

	// token invalid or expired
	if (!decode) return next(new CustomError("Login again", 403));

	let user = await User.findOne({ _id: decode.id }).select("+role");

	// sending token in cookie
	cookieToken(user, res);
});

// logout user
exports.logout = asyncHandler(async (req, res, next) => {
	res.clearCookie("token");

	return res.status(200).json({
		status: "success",
		message: "Logout success",
		data: {},
	});
});
