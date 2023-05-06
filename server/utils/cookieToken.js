const jwt = require("jsonwebtoken");

const options = {
	expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
	httpOnly: true,
};

exports.cookieToken = (user, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: "24h", // expires in 24 hours
	});

	// remove sensitive data from the user object.
	user._doc.password = undefined;
	user._doc.createdAt = undefined;
	user._doc.updatedAt = undefined;
	user._doc.token = token;

	// send the token as a cookie in the response
	res.status(201).cookie("token", token, options).json({
		status: "success",
		data: { user },
	});
};
