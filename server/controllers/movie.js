const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");

const { uploadToLocal } = require("../utils/imageUploader");

// models
const Movie = require("../models/movie");
const Show = require("../models/show");

/**
 * 	user controller for movies
 */

// get all movies && search movie
exports.userGetAllMovies = asyncHandler(async (req, res, next) => {
	const { searchKey } = req.query;

	/**
	 * if searched by user then give matched result
	 */
	const movieNameRegex = new RegExp(searchKey, "i");

	const movies = await Movie.find(
		{
			$or: [{ title: movieNameRegex }],
			status: { $ne: "deleted" },
		},
		{
			"images.poster": 1,
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
		message: "movies list fetched",
		data: {
			totalMovies: movies.length,
			movies,
		},
	});
});


// get movie detail
exports.getMovieById = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;

	if (!movieId) return next(new CustomError("Please add movie id", 400));

	const movie = await Movie.findOne(
		{ _id: movieId },
		{ createdAt: 0, updatedAt: 0 }
	);
	if (!movie) return next(new CustomError("Movie not found with this id", 400));

	const shows = await Show.find({ status: "starting soon", movie: movieId });
	for (const show of shows) {
		if (show.endTime <= Date.now()) show.status = "ended";
		else if (show.startTime <= Date.now()) show.status = "started";
		await show.save();
	}

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
	).sort({ startTime: 1 })
		.populate({
			path: "screen",
			model: "screen",
			select: "screenName",
		});

	res.status(200).json({

		status: "success",
		message: "movies details fetched",
		data: {
			movie,
			totalShows: showsForMovie.length,
			shows: showsForMovie,
		},

	});
});

/**
 * 	Admin controllers for movies
 */

// add movie
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
		return next(new CustomError("Please upload poster and banner image", 400));

	const { poster, banner } = req.files;

	const fileSize = 500000;

	if (
		poster.size / (1024 * 1024) > fileSize ||
		banner.size / (1024 * 1024) > fileSize
	) {
		return next(new CustomError(`Maximum image size is ${fileSize} MB`));
	}

	if (!poster || !banner)
		return next(new CustomError("Please upload poster and banner image", 400));

	let status =
		new Date(release_date) <= Date.now() ? "released" : "coming soon";

	const posterURL = await uploadToLocal(poster, "movies/poster", false);
	const bannerURL = await uploadToLocal(banner, "movies/banner", true);

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
		message: "movie added successfully",
		data: { movie },
	});
});

// delete movie
exports.deleteMovie = asyncHandler(async (req, res, next) => {
	const { movieIds } = req.query;

	if (!movieIds) return next(new CustomError("Provide MovieId(s)", 400));

	const objectIdArray = movieIds.split(",");

	const result = await Movie.updateMany(
		{ _id: { $in: objectIdArray } },
		{ $set: { status: "deleted" } }
	);

	await Show.updateMany(
		{ movie: { $in: objectIdArray } },
		{ $set: { status: "ended" } }
	);

	return res.status(200).json({
		status: "success",
		message: `${result.modifiedCount} movies deleted successfully`,
		data: {
			movieIds,
		},
	});
});

//update movie
exports.updateMovie = asyncHandler(async (req, res, next) => {
	const { movieId } = req.params;
	if (!movieId) return next(new CustomError("Provide MovieId", 400));

	if (req.files && req.files.poster) {
		const posterURL = await uploadToLocal(
			req.files.poster,
			"movies/poster",
			false
		);
		req.body.poster = posterURL;
	}

	if (req.files && req.files.banner) {
		const bannerURL = await uploadToLocal(
			req.files.banner,
			"movies/banner",
			true
		);
		req.body.banner = bannerURL;
	}

	req.body.images = { poster: req.body.poster, banner: req.body.banner };

	req.body.status =
		new Date(req.body.release_date) <= Date.now() ? "released" : "coming soon";

	const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updatedMovie) {
		return next(new CustomError("Movie not found", 404));
	}
	return res.status(200).json({
		status: "success",
		message: "Movie updated successfully",
		data: {},
	});
});

// get all added movies
exports.getAllMovies = asyncHandler(async (req, res, next) => {
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
		message: "movies list fetched",
		data: {
			movies,
		},
	});
});
