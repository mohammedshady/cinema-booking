const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const { uploadToLocal } = require("../utils/imageUploader");
const Movie = require("../models/movie");
const Show = require("../models/show");

/* 
	controller functions for user-facing routes
*/

// get all movies
exports.userGetAllMovies = asyncHandler(async (req, res, next) => {
	const movies = await Movie.find(
		{ status: { $ne: "deleted" } },
		{
			images: 1,
			duration: 1,
			language: 1,
			actors: 1,
			rating: 1,
			title: 1,
			status: 1,
			release_date: 1,
			genre: 1,
			description: 1,
		}
	).sort({
		release_date: -1,
	});

	return res.status(200).json({
		status: "success",
		message: "Movie list fetched",
		data: {
			totalMovies: movies.length,
			movies,
		},
	});
});

// get movie details
exports.userGetMovieById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide movie ID", 400));

	const movie = await Movie.findOne(
		{ _id: id },
		{ createdAt: 0, updatedAt: 0 }
	);

	if (!movie) return next(new CustomError("Movie not found", 400));

	// update status of shows that have already ended or have started
	const shows = await Show.find({ status: { $ne: "ended" }, movie: id });

	for (const show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

	// get shows for the movie, sorted by start time
	const showsForMovie = await Show.find(
		{ movie: id, status: "starting soon" },
		{
			movie: 0,
			endTime: 0,
			status: 0,
			seats: 0,
			createdAt: 0,
			updatedAt: 0,
		}
	)
		.sort({ startTime: 1 })
		.populate({
			path: "screen",
			model: "screen",
			select: "screenName",
		});

	res.status(200).json({
		status: "success",
		message: "Movie details fetched",
		data: {
			movie,
			totalShows: showsForMovie.length,
			shows: showsForMovie,
		},
	});
});

/* 
	controller functions for admin-facing routes
*/

// get all movies
exports.getAllMovies = asyncHandler(async (req, res, next) => {
	// update status of movies that have been released
	const updateMovies = await Movie.find({ status: "coming soon" });
	for (let movie of updateMovies) {
		const isReleased = movie.release_date <= Date.now();

		if (isReleased) {
			movie.status = "released";
			await movie.save();
		}
	}

	const movies = await Movie.aggregate([
		{
			$lookup: {
				from: "shows",
				let: { movieId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$movie", "$$movieId"] },
									{ $eq: ["$status", "starting soon"] },
								],
							},
						},
					},
					{ $count: "count" },
				],
				as: "shows",
			},
		},
		{
			$project: {
				title: 1,
				status: 1,
				date: "$release_date",
				duration: 1,
				shows: { $ifNull: [{ $arrayElemAt: ["$shows.count", 0] }, 0] },
			},
		},
	]);

	return res.status(200).json({
		status: "success",
		message: "Movies list fetched",
		data: {
			movies,
		},
	});
});

// populate movie form fields
exports.getMovieById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide a movie ID", 400));

	const movie = await Movie.findOne(
		{ _id: id },
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

	if (!movie) return next(new CustomError("Movie not found", 404));

	// split actors, language and genre fields into arrays
	movie.actors = movie.actors[0].split(",");
	movie.language = movie.language[0].split(",");
	movie.genre = movie.genre[0].split(",");

	// convert release_date to a Date object
	const dateObject = new Date(movie.release_date.toString().split("T")[0]);
	dateObject.setDate(dateObject.getDate() + 1);
	movie.release_date = dateObject;

	res.status(200).json({
		status: "success",
		message: "Movie details fetched",
		data: {
			movie,
		},
	});
});

// add a new movie
exports.addMovie = asyncHandler(async (req, res, next) => {
	let {
		title,
		description,
		release_date,
		language,
		duration,
		genre,
		actors,
		rating,
	} = req.body;

	if (!req.files)
		return next(
			new CustomError("Please upload both poster and banner images", 400)
		);

	const { poster, banner } = req.files;

	if (!poster) return next(new CustomError("Please upload poster image", 400));
	if (!banner) return next(new CustomError("Please upload banner image", 400));

	let status =
		new Date(release_date) <= Date.now() ? "released" : "coming soon";

	const posterURL = await uploadToLocal(poster, "movies/poster", false);
	const bannerURL = await uploadToLocal(banner, "movies/banner", true);

	// split genre, language, and actors fields into arrays
	genre = genre.split(",");
	language = language.split(",");
	actors = actors.split(",");

	const movieData = {
		title,
		description,
		release_date,
		status,
		language,
		duration,
		genre,
		actors,
		rating,
		images: { poster: posterURL, banner: bannerURL },
	};

	const movie = await Movie.create(movieData);

	res.status(201).json({
		status: "success",
		message: "Movie added successfully",
		data: { movie },
	});
});

// update an existing movie
exports.updateMovie = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide a movie ID", 400));

	// if poster image is uploaded, upload it to local storage and get its URL
	if (req.files && req.files.poster) {
		const posterURL = await uploadToLocal(
			req.files.poster,
			"movies/poster",
			false
		);
		req.body.poster = posterURL;
	}

	// if banner image is uploaded, upload it to local storage and get its URL
	if (req.files && req.files.banner) {
		const bannerURL = await uploadToLocal(
			req.files.banner,
			"movies/banner",
			true
		);
		req.body.banner = bannerURL;
	}

	// set images object to poster and banner URLs
	req.body.images = { poster: req.body.poster, banner: req.body.banner };

	// set movie status based on release date
	req.body.status =
		new Date(req.body.release_date) <= Date.now() ? "released" : "coming soon";

	// find and update movie by ID with the new data
	const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedMovie) {
		return next(new CustomError("Movie not found", 404));
	}

	return res.status(200).json({
		status: "success",
		message: "Movie updated successfully",
		data: { updatedMovie },
	});
});

// delete one or more movies by ID
exports.deleteMovies = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide movie ID(s)", 400));

	const idsArray = ids.split(",");

	const result = await Movie.updateMany(
		{ _id: { $in: idsArray } },
		{ $set: { status: "deleted" } }
	);

	await Show.updateMany(
		{ movie: { $in: idsArray } },
		{ $set: { status: "ended" } }
	);

	return res.status(200).json({
		status: "success",
		message: `${result.modifiedCount} movie(s) deleted successfully`,
	});
});
