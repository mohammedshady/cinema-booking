const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const Booking = require("../models/booking");
const Show = require("../models/show");

/* 
	controller functions for user-facing routes
*/

// get user bookings
exports.userGetBookings = asyncHandler(async (req, res, next) => {
	// find all bookings belonging to the authenticated user
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

	// check if each booking has expired
	for (let booking of bookings) {
		if (booking.show.startTime < Date.now()) booking._doc.isExpired = true;
		else booking._doc.isExpired = false;
	}

	return res.status(200).json({
		status: "success",
		message: "Booking list fetched successfully",
		data: {
			totalBookings: bookings.length,
			bookings,
		},
	});
});

// add a booking
exports.addBooking = asyncHandler(async (req, res, next) => {
	const { show, seats } = req.body;

	if (!show) return next(new CustomError("Please provide show ID", 400));
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

	if (!showDoc) return next(new CustomError("Show not found", 404));

	// get all available seats from the show document
	let userSeats = [];
	let availableSeats = [];
	let availableIndex = 0;
	for (let i = 0; i < showDoc.seats.length; i++) {
		if (showDoc.seats[i].available === true) {
			availableSeats[availableIndex] = showDoc.seats[i];
			availableIndex++;
		}
	}

	// check if the selected seats are available
	const bookedSeats = [];
	for (const seat of seats) {
		const seatDoc = availableSeats.find((s) => s._id.toString() === seat);
		if (!seatDoc) {
			return next(new CustomError(`Seat is already booked`));
		}
		bookedSeats.push(seatDoc);
	}

	// set the selected seats as unavailable
	for (const seat of bookedSeats) {
		seat.available = false;
		userSeats.push(seat.name);
	}
	await showDoc.save();

	// generate a unique booking ID
	let bookingId = "";

	for (let i = 0; i < 10; i++)
		bookingId += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
			Math.floor(Math.random() * 10)
		];

	// calculate the total amount for the booking
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

// delete a booking by ID
exports.deleteBooking = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const booking = await Booking.findById(id);

	if (!booking) {
		return next(new CustomError("Booking not found", 404));
	}

	// check if user is authorized to delete booking
	// if (booking.user.toString() !== req.user._id.toString()) {
	// 	return next(new CustomError("unAuthorized user for deletion", 400));
	// }

	const seats = booking.seats;

	const showId = booking.show.id;

	const show = await Show.findById(showId);

	if (!show) return next(new CustomError("Show not found", 404));

	// set the seats of the booking as available in the show document
	for (let i = 0; i < show.seats.length; i++) {
		for (let j = 0; j < seats.length; j++) {
			if (show.seats[i].name === seats[j]) show.seats[i].available = true;
		}
	}
	show.save();

	// remove the booking
	await booking.remove();

	res.status(200).json({
		status: "success",
		message: "Booking deleted successfully",
	});
});

/* 
	controller functions for admin-facing routes
*/

// get all bookings
exports.getAllBookings = asyncHandler(async (req, res, next) => {
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
				// concatenate the seats array into a comma-separated string
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
		message: "Bookings list fetched successfully",
		data: {
			bookings,
		},
	});
});

// delete one or more bookings by ID
exports.deleteBookings = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide booking ID(s)"));

	const idsArray = ids.split(",");

	const bookings = await Booking.find({ _id: { $in: idsArray } });

	// create a map to store the show seat availability updates for each booking
	const showSeatMap = new Map();

	// loop through each booking and update its associated show document to make its seats available
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

	const result = await Booking.deleteMany({ _id: { $in: idsArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} bookings deleted successfully`,
	});
});
