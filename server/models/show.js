const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const seatSchema = new Schema({
	name: String,
	row: Number,
	col: Number,
	available: {
		type: Boolean,
		default: true,
	},
});

const showSchema = new Schema(
	{
		movie: {
			type: SchemaTypes.ObjectId,
			ref: "Movie",
			required: [true, "Movie is required"],
		},
		price: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
			required: [true, "Show date is required"],
		},
		startTime: {
			type: Date,
			required: [true, "Show start time is required"],
		},
		endTime: {
			type: Date,
			required: [true, "Show end time is required"],
		},
		status: {
			type: String,
			enum: ["starting soon", "started", "ended"],
			default: "starting soon",
		},
		screen: {
			type: SchemaTypes.ObjectId,
			ref: "screen",
			required: true,
		},
		seats: [
			{
				type: seatSchema,
			},
		],
	},
	{ timestamps: true, versionKey: false }
);

const Show = mongoose.model("Show", showSchema);

module.exports = Show;
