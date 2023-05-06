const mongoose = require("mongoose");

const { Schema } = mongoose;

const screenSchema = new Schema(
	{
		screenName: {
			type: String,
			required: [true, "Screen name is required"],
		},
		totalSeats: {
			type: Number,
			required: [true, "Total screen seats is required"],
		}, // rows * columns
		totalRows: {
			type: Number,
			required: [true, "Total screen rows is required"],
		},
		totalColumns: {
			type: Number,
			required: [true, "Total screen columns is required"],
		},
	},
	{ timestamps: true, versionKey: false }
);

const Screen = mongoose.model("screen", screenSchema);

module.exports = Screen;
