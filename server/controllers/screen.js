const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const Screen = require("../models/screen");
const Show = require("../models/show");

/* 
	controller functions for admin-facing routes
*/

// get all Screens
exports.getAllScreens = asyncHandler(async (req, res, next) => {
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

// populate screen form fields
exports.getScreenById = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide a screen ID", 400));

	const screen = await Screen.findOne(
		{ _id: id },
		{ screenName: 1, totalRows: 1, totalColumns: 1 }
	);

	if (!screen) return next(new CustomError("Screen not found", 404));

	res.status(200).json({
		status: "success",
		message: "Screen details fetched successfully",
		data: {
			screen,
		},
	});
});

// add new screen
exports.addScreen = asyncHandler(async (req, res, next) => {
	const { screenName, totalRows, totalColumns } = req.body;

	if (!screenName || !totalRows || !totalColumns)
		return next(
			new CustomError("Screen name, rows, and columns are required", 400)
		);

	const existingScreen = await Screen.findOne({
		screenName: screenName.toUpperCase(),
	});

	if (existingScreen)
		return next(new CustomError("A screen already exists with this name", 400));

	const screenData = {
		screenName: screenName.toUpperCase(),
		totalRows: totalRows,
		totalColumns: totalColumns,
		totalSeats: totalRows * totalColumns,
	};

	const screen = await Screen.create(screenData);

	res.status(201).json({
		status: "success",
		message: "Screen added successfully",
		data: {
			screen: screen,
		},
	});
});

// update screen
exports.updateScreen = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!id) return next(new CustomError("Please provide a screen ID", 400));

	req.body.screenName = req.body.screenName.toUpperCase();
	req.body.totalSeats = req.body.totalRows * req.body.totalColumns;

	const updatedscreen = await Screen.findByIdAndUpdate(id, req.body, {
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

// delete one or more screen by ID
exports.deleteScreens = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide screen ID(s)", 400));

	const idsArray = ids.split(",");

	const result = await Screen.deleteMany({ _id: { $in: idsArray } });

    // update show status to "ended"
	await Show.updateMany(
		{ screen: { $in: idsArray } },
		{ $set: { status: "ended" } }
	);

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} screens deleted successfully`,
	});
});
