const asyncHandler = require("../middlewares/asyncHandler");
const { cookieToken } = require("../utils/cookieToken");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Movie = require("../models/movie");
const Show = require("../models/show");
const Booking = require("../models/booking");

/* 
	controller functions for user-facing routes
*/

// load user data from token
exports.loadUser = asyncHandler(async (req, res, next) => {
	// get token from cookie
	const token = req.cookies.token;

	// if token is unavailable, send null user
	if (!token)
		return res.status(200).json({
			status: "success",
			data: {
				user: null,
			},
		});

	// verify token using secret key
	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

	// if token is invalid or expired
	if (!decodedToken)
		return next(new CustomError("Invalid or expired token", 403));

	const user = await User.findById(decodedToken.id).select("+role");

	if (!user) {
		return next(new CustomError("User not found", 404));
	}

	// send updated token in cookie with every request
	cookieToken(user, res);
});

// sign up
exports.signUp = asyncHandler(async (req, res, next) => {
	const { name, email, mobile_no, birth_date, gender, password } = req.body;

	if (!email || !password) {
		return next(new CustomError("Email & password are required", 400));
	}

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		return next(new CustomError("User already exist", 400));
	}

	// create user
	const user = await User.create({
		name,
		email,
		mobileno: mobile_no,
		date_of_birth: birth_date,
		sex: gender,
		password,
	});

	// send token in cookie to keep user logged in
	cookieToken(user, res);

	res.status(201).json({
		status: "success",
		message: "Signup successful",
	});
});

// login
exports.logIn = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password)
		return next(new CustomError("Email & password are required", 400));

	const user = await User.findOne({ email }).select("+password +role");

	if (!user) {
		return next(new CustomError("User not found", 404));
	}

	// validate password against hashed password in db
	const isPasswordValid = await user.isValidatedPassword(password);

	if (!isPasswordValid) {
		return next(new CustomError("Incorrect password", 401));
	}

	// send token in cookie to keep user logged in
	cookieToken(user, res);

	res.status(200).json({
		status: "success",
		message: "Login successful",
	});
});

// logout user
exports.logOut = asyncHandler(async (req, res, next) => {
	// clear token from cookie to logout the user
	res.clearCookie("token");

	return res.status(200).json({
		status: "success",
		message: "Logout successful",
	});
});

// reset password
exports.resetPassword = async (req, res, next) => {
	const { email, date_of_birth, newPassword } = req.body;

	if (!email) return next(new CustomError("Email is required", 400));

	if (!newPassword)
		return next(new CustomError("Please enter a new password", 400));

	if (!date_of_birth)
		return next(new CustomError("Birthdate is required", 400));

		const user = await User.findOne({ email }).select('email date_of_birth');

	if (!user) return next(new CustomError("User not found", 404));

	if (
		user.date_of_birth.toISOString() !== new Date(date_of_birth).toISOString()
	) {
		return next(new CustomError("Incorrect birthdate", 400));
	}

	user.password = newPassword;

	await user.save();

	return res.status(200).json({ message: "Password reset successfully" });
};

/* 
	controller functions for admin-facing routes
*/

// get all data for dashboard
exports.getDashboardData = asyncHandler(async (req, res, next) => {
	// data for dashboard cards
	const totalMovies = await Movie.countDocuments({
		status: { $ne: "deleted" },
	});
	const totalUsers = await User.countDocuments({ role: 0 });
	const totalShows = await Show.countDocuments();
	const totalAmounts = await Booking.find({}, { totalAmount: 1, _id: 0 });
	const totalTicketSales = totalAmounts.reduce(
		(total, item) => total + item.totalAmount,
		0
	);

	const movies = await Movie.find({}, { title: 1, _id: 1, status: 1 });
	const users = await User.find({}, { email: 1, _id: 1 });

	// get bookings for all movies
	const bookings = await Booking.aggregate([
		{
			$group: {
				_id: "$movie",
				seats: { $push: "$seats" },
			},
			// group bookings by movie ID and push all seats into an array
		},
	]);

	// map movie titles to corresponding booking counts
	const barChartData = movies
		.filter((movie) => movie.status === "released") // filter out unreleased movies
		.map((movie) => {
			// find matching booking for the movie
			const matchingBooking = bookings.find(
				(booking) => booking._id.toString() === movie._id.toString()
			);

			// if no matching booking found, set count to 0
			const count = matchingBooking ? matchingBooking.seats.flat().length : 0;

			return { title: movie.title, count };
		});

	// create arrays for movie titles and booking counts
	const movieTitles = barChartData.map((data) => data.title);
	const bookingCounts = barChartData.map((data) => data.count);

	// recent activities
	const recentActivity = await User.aggregate([
		{
			$match: {
				role: 0,
			},
		},
		{
			$project: {
				_id: 0,
				activity: {
					message: "User Created: ",
					data: "$email",
					createdAt: "$createdAt",
				},
			},
		},
		{
			$unionWith: {
				coll: "shows",
				pipeline: [
					{
						$project: {
							_id: 0,
							activity: {
								message: "Show Created For Movie: ",
								data: "$movie",
								createdAt: "$createdAt",
							},
						},
					},
				],
			},
		},
		{
			$unionWith: {
				coll: "screens",
				pipeline: [
					{
						$project: {
							_id: 0,
							activity: {
								message: "Screen Created: ",
								data: "$screenName",
								createdAt: "$createdAt",
							},
						},
					},
				],
			},
		},
		{
			$unionWith: {
				coll: "movies",
				pipeline: [
					{
						$project: {
							_id: 0,
							activity: {
								message: "Movie Created: ",
								data: "$title",
								createdAt: "$createdAt",
							},
						},
					},
				],
			},
		},
		{
			$unionWith: {
				coll: "feedbacks",
				pipeline: [
					{
						$project: {
							_id: 0,
							activity: {
								message: "Feedback Created By: ",
								data: "$user",
								createdAt: "$createdAt",
							},
						},
					},
				],
			},
		},
		{
			$unionWith: {
				coll: "bookings",
				pipeline: [
					{
						$project: {
							_id: 0,
							activity: {
								message: "Booking Created By: ",
								data: "$user",
								createdAt: "$createdAt",
							},
						},
					},
				],
			},
		},
		{
			$sort: {
				"activity.createdAt": -1,
			},
			// sort activities by createdAt field in descending order (most recent first)
		},
		{
			$limit: 20,
		},
		// limit the number of activities to 20
	]);

	const messages = recentActivity.map((activity) => {
		let data = activity.activity.data;

		// check if the data is a movie ID, and replace it with the movie title
		const movie = movies.find((m) => m._id.toString() === data.toString());
		if (movie) {
			data = movie.title;
		}

		// check if the data is a user ID, and replace it with the user email
		const user = users.find((u) => u._id.toString() === data.toString());
		if (user) {
			data = user.email;
		}

		return { message: activity.activity.message + data };
	});

	return res.status(200).json({
		status: "success",
		message: "Dashboard data fetched successfully",
		data: {
			totalMovies,
			totalUsers,
			totalShows,
			totalTicketSales,
			movieTitles,
			bookingCounts,
			messages,
		},
	});
});

// get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find(
		{ role: { $ne: 1 } },
		{ name: 1, email: 1, mobileno: 1, dateTime: "$createdAt" }
	);

	return res.status(200).json({
		status: "success",
		message: "Users list fetched successfully",
		data: {
			users,
		},
	});
});

// delete one or more user by ID
exports.deleteUsers = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide user ID(s)", 400));

	const idsArray = ids.split(",");

	const result = await User.deleteMany({ _id: { $in: idsArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} users deleted successfully`,
	});
});
