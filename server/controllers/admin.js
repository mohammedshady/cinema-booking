const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const mongoose = require("mongoose");

// models
const Screen = require("../models/screen");
const Feedback = require("../models/feedback");
const Show = require("../models/show");
const Booking = require("../models/booking");
const Movie = require("../models/movie");
const User = require("../models/user");

// add new screen
exports.addScreen = asyncHandler(async (req, res, next) => {
	const { screenName, totalRows, totalColumns } = req.body;

	if (!screenName || !totalRows || !totalColumns)
		return next(new CustomError("Name, rows and columns are required"));

	const nameRegex = new RegExp(screenName, "i");

	let screen = await Screen.findOne({ screenName: nameRegex, deleted: false });

	if (screen)
		return next(new CustomError("Screen already exist with this name"));

	const screenData = {
		screenName: screenName.toUpperCase(),
		totalRows: totalRows,
		totalColumns: totalColumns,
		totalSeats: totalRows * totalColumns,
	};

	screen = await Screen.create(screenData);

	res.status(201).json({
		status: "success",
		message: "New Screen added",
		data: {
			screen: screen,
		},
	});
});

// delete screen
exports.deleteScreen = asyncHandler(async (req, res, next) => {
	const { screenIds } = req.query;

	if (!screenIds) return next(new CustomError("Please provide screen id"));

	const objectIdArray = screenIds.split(",");

	const result = await Screen.deleteMany({ _id: { $in: objectIdArray } });
	await Show.updateMany(
		{ screen: { $in: objectIdArray } },
		{ $set: { status: "ended" } }
	);

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} screens deleted successfully`,
		data: {
			screenIds,
		},
	});
});

// update screen
exports.updateScreen = asyncHandler(async (req, res, next) => {
	const { screenId } = req.params;

	if (!screenId) return next(new CustomError("Please provide Screen id"));

	req.body.totalSeats = req.body.totalRows * req.body.totalColumns;

	const updatedscreen = await Screen.findByIdAndUpdate(screenId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedscreen) {
		return next(new CustomError("Screen not found", 404));
	}

	res.status(200).json({
		status: "success",
		message: "Screen updated successfully",
		data: {
			screen: updatedscreen,
		},
	});
});

// get all Screens
exports.getScreens = asyncHandler(async (req, res, next) => {
	const screens = await Screen.find({}, { updatedAt: 0, createdAt: 0 });

	if (!screens) return next(new CustomError("Found no Screens", 404));

	res.status(200).json({
		status: "success",
		message: "Screens list fetched",
		data: {
			screens,
		},
	});
});

// view all feedbacks
exports.viewFeedback = asyncHandler(async (req, res, next) => {
	const feedbacks = await Feedback.aggregate([
		{ $sort: { createdAt: -1 } },
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
			},
		},
		{ $addFields: { email: { $arrayElemAt: ["$user.email", 0] } } },
		{ $project: { date: "$createdAt", email: 1, message: 1 } },
	]);

	return res.status(200).json({
		status: "success",
		message: "feedback list fetched",
		data: {
			feedbacks,
		},
	});
});

// Delete a feedback
exports.deleteFeedback = asyncHandler(async (req, res, next) => {
	const { feedBackIds } = req.query;

	if (!feedBackIds) return next(new CustomError("Please provide FeedBack ids"));

	const objectIdArray = feedBackIds.split(",");

	const result = await Feedback.deleteMany({ _id: { $in: objectIdArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} feedbacks deleted successfully`,
		data: {
			feedBackIds,
		},
	});
});

// view scheduled shows analytics
exports.getScheduledShowsAndAnalytics = asyncHandler(async (req, res, next) => {
	let shows = await Show.find({ status: { $ne: "ended" } });

	for (let show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

	shows = await Show.aggregate([
		{
			$lookup: {
				from: "screens",
				localField: "screen",
				foreignField: "_id",
				as: "screen",
			},
		},
		{
			$lookup: {
				from: "movies",
				localField: "movie",
				foreignField: "_id",
				as: "movie",
			},
		},
		{
			$unwind: { path: "$screen" },
		},
		{
			$unwind: { path: "$movie" },
		},
		{
			$addFields: {
				dateTime: "$date",
			},
		},
		{
			$project: {
				createdAt: 0,
				updatedAt: 0,
				startTime: 0,
				endTime: 0,
				date: 0,
			},
		},
	]);

	shows.forEach((show) => {
		let bookedSeats = 0;
		for (let i = 0; i < show.seats.length; i++) {
			if (show.seats[i].available === false) bookedSeats++;
		}
		show.totalBookings = bookedSeats;
		show.movie = show.movie.title;
		show.screen = show.screen.screenName;
		show.seats = undefined;
	});

	return res.status(200).json({
		status: "success",
		message: "show analytics fetched",
		data: {
			shows,
		},
	});
});

// populate show form fields
exports.populateShowForm = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Provide showId", 400));

	const show = await Show.findOne(
		{ _id: showId },
		{ movie: 1, price: 1, date: 1, screen: 1 }
	).populate([
		{
			path: "screen",
			model: "screen",
			select: "screenName",
		},
		{
			path: "movie",
			model: "Movie",
			select: "title",
		},
	]);

	if (!show) return next(new CustomError("Show not found", 400));

	res.status(200).json({
		status: "success",
		message: "show details fetched",
		data: {
			show,
		},
	});
});
// populate screen form fields
exports.populateScreenForm = asyncHandler(async (req, res, next) => {
	const { screenId } = req.params;

	if (!screenId) return next(new CustomError("Provide screenId", 400));

	const screen = await Screen.findOne(
		{ _id: screenId },
		{ screenName: 1, totalRows: 1, totalColumns: 1 }
	);

	if (!screen) return next(new CustomError("Screen not found", 400));

	res.status(200).json({
		status: "success",
		message: "screen details fetched",
		data: {
			screen,
		},
	});
});

// populate movie form fields
exports.populateMovieForm = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Provide movieId", 400));

	const movie = await Movie.findOne(
		{ _id: movieId },
		{
			title: 1,
			language: 1,
			description: 1,
			release_date: 1,
			images: 1,
			duration: 1,
			genre: 1,
			actors: 1,
			rating: 1,
		}
	);

	if (!movie) return next(new CustomError("Movie not found", 400));

	movie.actors = movie.actors[0].split(",");
	movie.language = movie.language[0].split(",");
	movie.genre = movie.genre[0].split(",");

	const dateObject = new Date(movie.release_date.toString().split("T")[0]);
	dateObject.setDate(dateObject.getDate() + 1);
	movie.release_date = dateObject;

	res.status(200).json({
		status: "success",
		message: "movie details fetched",
		data: {
			movie,
		},
	});
});

// get all data for dashboard
exports.getAllData = asyncHandler(async (req, res, next) => {
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

	// Get bookings for all movies
	const bookings = await Booking.aggregate([
		{
			$group: {
				_id: "$movie",
				seats: { $push: "$seats" },
			},
		},
	]);

	// Map movie titles to corresponding booking counts
	const barChartData = movies
		.filter((movie) => movie.status === "released") // Filter out unreleased movies
		.map((movie) => {
			// Find matching booking for the movie
			const matchingBooking = bookings.find(
				(booking) => booking._id.toString() === movie._id.toString()
			);

			// If no matching booking found, set count to 0
			const count = matchingBooking ? matchingBooking.seats.flat().length : 0;

			return { title: movie.title, count };
		});

	// Create arrays for movie titles and booking counts
	const movieTitles = barChartData.map((data) => data.title);
	const bookingCounts = barChartData.map((data) => data.count);

	// Recent Activities!!
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
		},
		{
			$limit: 20,
		},
	]);

	const messages = [];

	for (const activity of recentActivity) {
		let data = activity.activity.data;

		// Check if the data is a movie ID, and replace it with the movie title if it is
		const movie = movies.find((m) => m._id.toString() === data.toString());
		if (movie) {
			data = movie.title;
		}

		// Check if the data is a user ID, and replace it with the user email if it is
		const user = users.find((u) => u._id.toString() === data.toString());
		if (user) {
			data = user.email;
		}

		// Concatenate the message and the data
		const message = { message: activity.activity.message + data };

		messages.push(message);
	}

	return res.status(200).json({
		status: "success",
		message: "dashboard data fetched",
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

// get all released movies
exports.getDetailsForShowForm = asyncHandler(async (req, res, next) => {
	const movies = await Movie.find({ status: "released" }, { title: 1 });
	const screens = await Screen.find({}, { updatedAt: 0, createdAt: 0 });

	if (!screens) return next(new CustomError("Found no Screens", 404));
	if (movies.length === 0) return next(new CustomError("found no Movies", 404));

	return res.status(200).json({
		status: "success",
		message: "movies list fetched",
		data: {
			totalMovies: movies.length,
			movies,
			screens,
		},
	});
});

// view all bookings
exports.viewBookings = asyncHandler(async (req, res, next) => {
	const bookings = await Booking.aggregate([
		{
			$lookup: {
				from: "users",
				localField: "user",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$lookup: {
				from: "movies",
				localField: "movie",
				foreignField: "_id",
				as: "movie",
			},
		},
		{
			$unwind: "$movie",
		},
		{
			$project: {
				_id: 1,
				seats: {
					$reduce: {
						input: "$seats",
						initialValue: "",
						in: {
							$concat: [
								"$$value",
								{ $cond: [{ $eq: ["$$value", ""] }, "", " , "] },
								"$$this",
							],
						},
					},
				},
				screenName: "$show.screenName",
				dateTime: "$show.date",
				name: "$user.name",
				email: "$user.email",
				movie: "$movie.title",
			},
		},
	]);

	return res.status(200).json({
		status: "success",
		message: "bookings list fetched",
		data: {
			bookings,
		},
	});
});

// Delete bookings
exports.deleteBookings = asyncHandler(async (req, res, next) => {
	const { bookingIds } = req.query;

	if (!bookingIds) return next(new CustomError("Please provide Booking Ids"));

	const objectIdArray = bookingIds.split(",");

	const bookings = await Booking.find({ _id: { $in: objectIdArray } });

	const showSeatMap = new Map();

	for (let booking of bookings) {
		const seats = booking.seats;
		const showId = booking.show.id;

		const show = await Show.findById(showId);

		if (!show)
			return next(
				new CustomError("No shows associated with this booking", 400)
			);

		for (let i = 0; i < show.seats.length; i++) {
			for (let j = 0; j < seats.length; j++) {
				if (show.seats[i].name === seats[j]) {
					show.seats[i].available = true;
					const key = `${showId}_${show.seats[i].name}`;
					showSeatMap.set(key, show.seats[i].available);
				}
			}
		}

		show.save();
	}

	const result = await Booking.deleteMany({ _id: { $in: objectIdArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} bookings deleted successfully`,
		data: {
			bookingIds,
		},
	});
});

// view all users
exports.viewUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find(
		{role: {$ne: 1}},
		{ name: 1, email: 1, mobileno: 1, dateTime: "$createdAt" }
	);

	return res.status(200).json({
		status: "success",
		message: "users list fetched",
		data: {
			users,
		},
	});
});

// Delete users
exports.deleteUsers = asyncHandler(async (req, res, next) => {
	const { userIds } = req.query;

	if (!userIds) return next(new CustomError("Please provide FeedBack ids"));

	const objectIdArray = userIds.split(",");

	const result = await User.deleteMany({ _id: { $in: objectIdArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} users deleted successfully`,
		data: {
			userIds,
		},
	});
});
