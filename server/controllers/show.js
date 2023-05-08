const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const Show = require("../models/show");
const Movie = require("../models/movie");
const Screen = require("../models/screen");
const Booking = require("../models/booking");

/* 
	controller functions for user-facing routes
*/

// get show list by movie id
exports.getShowByMovieId = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide movie ID", 400));

	const movie = await Movie.findOne({ _id: id }, { title: 1, _id: 0 });

	if (!movie) return next(new CustomError("Movie not found", 400));

	// update status of shows that have already ended or have started
	const shows = await Show.find({ status: { $ne: "ended" }, movie: id });

	for (const show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}


	// get shows for the movie
	const showsForMovie = await Show.find(
		{ movie: id, status: "starting soon" },
	)
		.populate({
			path: "screen",
			model: "screen",
			select: "screenName",
		});

	res.status(200).json({
		status: "success",
		message: "Show list fetched successfully",
		data: {
			movie: movie.title,
			totalShows: showsForMovie.length,
			shows: showsForMovie,
		},
	});
});

// get show seats details
exports.getShowDetails = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide show ID", 400));

	const show = await Show.findOne(
		{ _id: id },
		{ movie: 1, price: 1, seats: 1, startTime: 1 }
	).populate({
		path: "screen",
		model: "screen",
		select: "totalRows totalColumns -_id",
	});

	if (!show) return next(new CustomError("Show not found", 404));

	const movie = await Movie.findById(show.movie, { title: 1, duration: 1 });
	if (!movie) return next(new CustomError("Movie for show not found", 404));

	return res.status(200).json({
		status: "success",
		message: "Show details fetched successfully",
		data: {
			show,
			movie,
		},
	});
});

/* 
	controller functions for admin-facing routes
*/

// get all shows
exports.getAllShows = asyncHandler(async (req, res, next) => {
	// update status of shows that have already ended or have started
	const updateShows = await Show.find({ status: { $ne: "ended" } });

	for (const show of updateShows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

	const shows = await Show.aggregate([
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
			$unwind: "$screen",
		},
		{
			$unwind: "$movie",
		},
		{
			$addFields: {
				dateTime: "$date",
				screen: "$screen.screenName",
				movie: "$movie.title",
				totalBookings: {
					$reduce: {
						input: "$seats",
						initialValue: 0,
						in: {
							$cond: {
								if: { $eq: ["$$this.available", false] },
								then: { $add: ["$$value", 1] },
								else: "$$value",
							},
						},
					},
				},
			},
		},
		{
			$project: {
				createdAt: 0,
				updatedAt: 0,
				startTime: 0,
				endTime: 0,
				date: 0,
				seats: 0,
			},
		},
	]);

	return res.status(200).json({
		status: "success",
		message: "Shows fetched successfully",
		data: {
			shows,
		},
	});
});

// get movies and screens options for show form
exports.getShowOptions = asyncHandler(async (req, res, next) => {
	const releasedMovies = await Movie.find({ status: "released" }, { title: 1 });
	const availableScreens = await Screen.find({}, { screenName: 1 });

	if (releasedMovies.length === 0)
		return next(new CustomError("No released movies found", 404));
	if (availableScreens.length === 0)
		return next(new CustomError("No available screens found", 404));

	return res.status(200).json({
		status: "success",
		message: "Movies and screens options fetched successfully",
		data: {
			movies: releasedMovies,
			screens: availableScreens,
		},
	});
});

// get show details for populating form fields
exports.getShowById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide show ID", 400));

	const show = await Show.findOne(
		{ _id: id },
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

	if (!show) return next(new CustomError("Show not found", 404));

	res.status(200).json({
		status: "success",
		message: "Show details fetched successfully",
		data: {
			show,
		},
	});
});

// add new show
exports.addShow = asyncHandler(async (req, res, next) => {
	let { movie, price, dateTime, screen } = req.body;

	if (!movie || !screen)
		return next(new CustomError("Please provide movie & screen", 400));

	dateTime = new Date(dateTime);

	if (+dateTime <= Date.now())
		return next(new CustomError("Please select appropriate date & time", 400));

	const movieDoc = await Movie.findOne(
		{ _id: movie, status: "released" },
		{ duration: 1, title: 1 }
	);

	if (!movieDoc) return next(new CustomError("This movie doesn't exist", 400));

	const cinemaScreen = await Screen.findOne({ _id: screen });

	if (!cinemaScreen)
		return next(new CustomError("This screen doesn't exist", 400));

	const startTime = new Date(dateTime);
	const endTime = new Date(
		startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000
	); // start time + duration + 10 mins for maintenance

	// check if there is already a show scheduled for the given time and screen
	const existingShow = await Show.findOne({
		status: { $ne: "ended" },
		screen,
		$or: [
			{ startTime: { $gte: startTime, $lte: endTime } }, // overlapping start time
			{ endTime: { $gte: startTime, $lte: endTime } }, // overlapping end time
			{
				$and: [
					{ startTime: { $lte: startTime } }, // show starts before the new show
					{ endTime: { $gte: endTime } }, // show ends after the new show
				],
			},
		],
	});

	if (existingShow)
		return next(
			new CustomError("There is already a show for this time and screen", 400)
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

	// generate seats for the new show based on screen dimensions
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
		message: "New show added successfully",
		data: { show },
	});
});

// update show details
exports.updateShow = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide show ID", 400));

	const show = await Show.findOne({ _id: id }).populate({
		path: "screen",
		model: "screen",
		select: "screenName totalSeats",
	});

	if (!show) return next(new CustomError("Show not found", 404));

	let { movie, price, dateTime, screen } = req.body;

	// check if dateTime is in the future
	if (new Date(dateTime).getTime() <= Date.now())
		return next(new CustomError("Please select appropriate date & time", 400));

	const selectedMovie = await Movie.findById(movie);

	if (!selectedMovie) {
		return next(new CustomError("Movie not found", 404));
	}

	// calculate new show start and end time based on selected movie duration and dateTime
	const duration = selectedMovie.duration;
	const startTime = new Date(dateTime);
	const endTime = new Date(
		startTime.getTime() + duration * 60 * 1000 + 10 * 60 * 1000
	); // start time + duration + 10 mins for maintenance

	// check if there is already a show scheduled for the given time and screen
	const existingShow = await Show.findOne({
		_id: { $ne: id },
		status: { $ne: "ended" },
		screen,
		$or: [
			{ startTime: { $gte: startTime, $lte: endTime } }, // overlapping start time
			{ endTime: { $gte: startTime, $lte: endTime } }, // overlapping end time
			{
				$and: [
					{ startTime: { $lte: startTime } }, // show starts before the new show
					{ endTime: { $gte: endTime } }, // show ends after the new show
				],
			},
		],
	});

	if (existingShow)
		return next(
			new CustomError(
				"There is already a show scheduled for this time and screen",
				400
			)
		);

	// update screen and available seats
	if (screen) {
		// find new screen document for the given screen ID
		const newScreen = await Screen.findOne({ _id: screen });

		// generate new seats based on new screen dimensions
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

		// update show document with new screen and seats data
		show.screen = screen;
		show.seats = newSeats;
	}

	// update movie, price, and date/time data if provided
	if (movie) show.movie = movie;
	if (price) show.price = price;
	if (dateTime) {
		dateTime = new Date(dateTime);
		show.date = dateTime;
		show.startTime = dateTime;

		const movieDoc = await Movie.findOne({ _id: movie }, { duration: 1 });

		show.endTime = new Date(
			show.startTime.getTime() + movieDoc.duration * 60 * 1000 + 10 * 60 * 1000
		); // start time + duration + 10 mins for maintenance
	}

	// delete all bookings for the updated show and save
	await Booking.deleteMany({ "show.id": id });
	await show.save();

	res.status(200).json({
		status: "success",
		message: "Show updated successfully",
		data: {
			show,
		},
	});
});

// delete one or more shows by ID
exports.deleteShows = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide show ID(s)", 400));

	const idsArray = ids.split(",");

	const date = new Date();

	// update all the shows with the ids to "ended" status and set the endTime to the current date
	const result = await Show.updateMany(
		{ _id: { $in: idsArray } },
		{ $set: { status: "ended", endTime: date } }
	);

	return res.status(200).json({
		status: "success",
		message: `${result.modifiedCount} shows deleted successfully`,
	});
});
