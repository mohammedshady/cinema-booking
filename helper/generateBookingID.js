// const { BOOKING_ID_LENGTH } = require("../config");

exports.generateBookingID = () => {
	const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	const len = 10;

	let output = "";

	for (let i = 0; i < len; i++) output += str[Math.floor(Math.random() * len)];

	return output;
};
