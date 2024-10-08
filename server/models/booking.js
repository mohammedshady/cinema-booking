const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const bookingSchema = new Schema(
	{
		user: {
			type: SchemaTypes.ObjectId,
			ref: "User",
		},
		bookingId: {
			type: String,
			required: true,
		},
		seats: [String],
		show: {
			id: SchemaTypes.ObjectId,
			screenName: String,
			date: Date,
			startTime: Date,
			price: Number,
		},
		movie: {
			type: SchemaTypes.ObjectId,
			ref: "Movie",
		},
		totalAmount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true, versionKey: false }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;