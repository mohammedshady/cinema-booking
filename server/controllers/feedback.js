const asyncHandler = require("../middlewares/asyncHandler");
const CustomError = require("../utils/customError");
const Feedback = require("../models/feedback");

/* 
	controller functions for user-facing routes
*/

// add a feedback
exports.addFeedback = asyncHandler(async (req, res, next) => {
	const { message } = req.body;

	if (!message) return next(new CustomError("Please add feedback message", 400));

	const feedbackData = {
		message,
		user: req.user._id,
	};

	const feedback = await Feedback.create(feedbackData);

	return res.status(201).json({
		status: "success",
		message: "Feedback added successfully",
		data: {
			feedback,
		},
	});
});

/* 
	controller functions for admin-facing routes
*/

// get all feedbacks
exports.getFeedbacks = asyncHandler(async (req, res, next) => {
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
		message: "Feedback list fetched successfully",
		data: {
			feedbacks,
		},
	});
});

// delete one or more feedbacks by ID
exports.deleteFeedbacks = asyncHandler(async (req, res, next) => {
	const { ids } = req.query;

	if (!ids) return next(new CustomError("Please provide feedback ID(s)"));

	const idsArray = ids.split(",");

	const result = await Feedback.deleteMany({ _id: { $in: idsArray } });

	res.status(200).json({
		status: "success",
		message: `${result.deletedCount} feedbacks deleted successfully`,
	});
});