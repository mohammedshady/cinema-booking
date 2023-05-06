const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");

// models
const Show = require("../models/show");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Booking = require("../models/booking");

// add new show
exports.addNewShow = asyncHandler(async (req, res, next) => {
	let { movie, price, dateTime, screen } = req.body;

	if (!movie || !screen)
		return next(new CustomError("Provide movie & cinema screen", 400));

	dateTime = new Date(dateTime);

	if (+dateTime <= Date.now())
		return next(new CustomError("Please select appropriate date & time", 400));

	const movieDoc = await Movie.findOne(
		{ _id: movie, status: "released" },
		{ duration: 1, title: 1 }
	);

	if (!movieDoc)
		return next(new CustomError("Can't add show for this movie", 400));

	const cinemaScreen = await Screen.findOne({ _id: screen });

	if (!cinemaScreen)
		return next(new CustomError("Cinema screen doesn't exist", 400));

	const startTime = new Date(dateTime);
	const endTime = new Date(
		startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000
	);

	// check if there is already a show for the given time and screen
	const existingShow = await Show.findOne({
		status: { $ne: "ended" },
		screen,
		$or: [
			{ startTime: { $gte: startTime, $lte: endTime } },
			{ endTime: { $gte: startTime, $lte: endTime } },
			{
				$and: [
					{ startTime: { $lte: startTime } },
					{ endTime: { $gte: endTime } },
				],
			},
		],
	});
	if (existingShow)
		return next(
			new CustomError(
				"There is already a show for this time and cinema screen",
				400
			)
		);

	const showData = {
		movie,
		price,
		date: dateTime,
		startTime,
		endTime,
		screen,
		seats: [],
	};

	const seatMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	for (let row = 0; row < cinemaScreen.totalRows; row++) {
		for (let col = 0; col < cinemaScreen.totalColumns; col++) {
			const seatName = seatMap[row] + (col + 1);
			const seat = {
				name: seatName,
				row: row + 1,
				col: col + 1,
				available: true,
			};
			showData.seats.push(seat);
		}
	}

	const show = await Show.create(showData);

	res.status(201).json({
		status: "success",
		message: "new show added",
		data: { show },
	});
});

//delete a show
exports.deleteShow = asyncHandler(async (req, res, next) => {
	const { showIds } = req.query;

	if (!showIds) return next(new CustomError("Provide showIds", 400));

	const objectIdArray = showIds.split(",");

	const date = new Date();

	const result = await Show.updateMany(
		{ _id: { $in: objectIdArray } },
		{ $set: { status: "ended", endTime: date } }
	);

	return res.status(200).json({
		status: "success",
		message: `${result.modifiedCount} shows deleted successfully`,
		data: {
			showIds,
		},
	});
});

exports.bookShow = asyncHandler(async (req, res, next) => {
	const { show, seats } = req.body;

	if (!show) return next(new CustomError("Please provide showId", 400));
	if (!seats || seats.length === 0)
		return next(new CustomError("Please select at least one seat", 400));

	const showDoc = await Show.findOne(
		{ _id: show },
		{
			seats: 1,
			price: 1,
			date: 1,
			startTime: 1,
			movie: 1,
		}
	).populate([
		{
			path: "screen",
			model: "screen",
			select: "screenName",
		},
		{
			path: "movie",
			model: "Movie",
			select: "images title",
		},
	]);

	if (!showDoc) return next(new CustomError("Show not found", 400));

	let userSeats = [];
	let availableSeats = [];
	let availableIndex = 0;
	for (let i = 0; i < showDoc.seats.length; i++) {
		if (showDoc.seats[i].available === true) {
			availableSeats[availableIndex] = showDoc.seats[i];
			availableIndex++;
		}
	}

	// check if seats are available
	const bookedSeats = [];
	for (const seat of seats) {
		const seatDoc = availableSeats.find((s) => s._id.toString() === seat);
		if (!seatDoc) {
			return next(new CustomError(`Seat is already booked`));
		}
		bookedSeats.push(seatDoc);
	}

	// set seats as unavailable
	for (const seat of bookedSeats) {
		seat.available = false;
		userSeats.push(seat.name);
	}
	await showDoc.save();

	// generate booking id
	let bookingId = "";

	for (let i = 0; i < 10; i++)
		bookingId += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
			Math.floor(Math.random() * 10)
		];

	let totalAmount = showDoc.price * bookedSeats.length;

	const bookingDoc = {
		seats: userSeats,
		show: {
			id: show,
			screenName: showDoc.screen.screenName,
			date: showDoc.date,
			startTime: showDoc.startTime,
			price: showDoc.price,
		},
		movie: showDoc.movie._id,
		totalAmount,
		bookingId,
		user: req.user._id,
	};

	const booking = await Booking.create(bookingDoc);

	res.status(201).json({
		status: "success",
		message: "show booked successfully",
		data: {
			booking,
		},
	});
});

// update show details
exports.updateShowDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Please provide showId", 400));

	const show = await Show.findOne({ _id: showId }).populate({
		path: "screen",
		model: "screen",
		select: "screenName totalSeats",
	});

	if (!show) return next(new CustomError("Show not found", 400));

	const isAnyBooking = await Booking.findOne(
		{ show: { _id: showId } },
		{ _id: 1 }
	);

	if (isAnyBooking)
		return next(
			new CustomError("Can't update this show, because there is booking", 400)
		);

	// destructure update data
	let { movie, price, dateTime, screen } = req.body;

	if (new Date(dateTime).getTime() <= Date.now())
		return next(new CustomError("Please select appropriate date & time", 400));

	const selectedMovie = await Movie.findById(movie);

	if (!selectedMovie) {
		return next(new CustomError("Movie not found", 404));
	}

	const duration = selectedMovie.duration;
	const showStart = new Date(dateTime);
	const showEnd = new Date(
		showStart.getTime() + duration * 60 * 1000 + 10 * 60 * 1000
	);

	const existingShow = await Show.findOne({
		_id: { $ne: showId },
		status: { $ne: "ended" },
		screen,
		$or: [
			{ startTime: { $gte: showStart, $lte: showEnd } },
			{ endTime: { $gte: showStart, $lte: showEnd } },
			{
				$and: [
					{ startTime: { $lte: showStart } },
					{ endTime: { $gte: showEnd } },
				],
			},
		],
	});
	if (existingShow)
		return next(
			new CustomError(
				"There is already a show for this time and cinema screen",
				400
			)
		);

	// update screen and available seats
	if (screen) {
		const newScreen = await Screen.findOne({ _id: screen });
		const seatMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const newSeats = [];

		for (let row = 0; row < newScreen.totalRows; row++) {
			for (let col = 0; col < newScreen.totalColumns; col++) {
				const seatName = seatMap[row] + (col + 1);
				const seat = {
					name: seatName,
					row: row + 1,
					col: col + 1,
					available: true,
				};
				newSeats.push(seat);
			}
		}

		show.screen = screen;
		show.seats = newSeats;
	}

	// update other details
	if (movie) show.movie = movie;
	if (price) show.price = price;
	if (dateTime) {
		dateTime = new Date(dateTime);
		show.date = dateTime;
		show.startTime = dateTime;

		const movieDoc = await Movie.findOne({ _id: movie }, { duration: 1 });

		// endtime = startTime + movie duration + 10 minutes (of interval)
		show.endTime = new Date(
			show.startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000
		);
	}

	// save the updated show document
	await Booking.deleteMany({ "show.id": showId });
	await show.save();

	res.status(200).json({
		status: "success",
		message: "show updated successfully",
		data: {
			show,
		},
	});
});

// get show list by movie id
exports.getShowByMovie = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Please add movie id", 400));

	const movie = await Movie.findOne({ _id: movieId }, { title: 1, _id: 0 });

	if (!movie) return next(new CustomError("Movie not found with this id", 400));

	// Update show status based on expiry
	const shows = await Show.find({ status: "starting soon", movie: movieId });
	for (const show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

	let { sortBy, order } = req.query;

	sortBy = sortBy || "date";
	order = order || 1;

	// Get shows for the movie
	const showsForMovie = await Show.find(
		{ movie: movieId, status: "starting soon" },
		{
			movie: 0,
			endTime: 0,
			status: 0,
			seats: 0,
			createdAt: 0,
			updatedAt: 0,
		}
	)
		.sort({ [`${sortBy}`]: order })
		.populate({
			path: "screen",
			model: "screen",
			select: "screenName",
		});

	res.status(200).json({
		status: "success",
		message: "Show list fetched",
		data: {
			movie: movie.title,
			totalShows: showsForMovie.length,
			shows: showsForMovie,
		},
	});
});

// get show seats details
exports.getShowSeatsDetails = asyncHandler(async (req, res, next) => {
	const { showId } = req.params;

	if (!showId) return next(new CustomError("Please add showId", 400));

	const show = await Show.findOne(

		{ _id: showId },
		{ movie: 1, price: 1, seats: 1, startTime: 1 }
	).populate({
		path: "screen",
		model: "screen",
		select: "totalRows totalColumns -_id",
	});

	if (!show) return next(new CustomError("Show not found", 400));

	const movie = await Movie.findById(show.movie, { title: 1, duration: 1 });
	if (!movie) return next(new CustomError("Movie for Show not found", 400));

	return res.status(200).json({
		status: "success",
		message: "show details fetched",
		data: {
			show,
			movie,
		},
	});
});
