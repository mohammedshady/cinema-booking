const mongoose = require("mongoose");

const { Schema } = mongoose;

const screenSchema = new Schema(
	{
		screenName: {
			type: String,
			required: [true, "cinema screen name is required"],
		},
		totalSeats: {
			type: Number,
			required: [true, "Total cinema screen seats is required"],
		}, // rows * columns
		totalRows: {
			type: Number,
			required: [true, "total number of cinema screen rows is required"],
		},
		totalColumns: {
			type: Number,
			required: [true, "total number of cinema screen columns is required"],
		},
	},
	{ timestamps: true, versionKey: false }
);

const Screen = mongoose.model("screen", screenSchema);

module.exports = Screen;
