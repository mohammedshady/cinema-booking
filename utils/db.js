const mongoose = require("mongoose");

exports.connect = () => {
	mongoose.set("strictQuery", true);
	mongoose
		.connect(process.env.DB_URL)
		.then((res) => console.log(`Db connected on: ${res.connection.host}:${res.connection.port}`))
		.catch((err) => {
			console.log(err);
			process.exit(1);
		});
};
