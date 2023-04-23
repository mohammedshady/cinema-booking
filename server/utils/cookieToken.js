const jwt = require("jsonwebtoken");

// setting cookie options
const options = {
	expires: new Date(Date.now() + 7 * 20 * 60 * 60 * 1000),
	httpOnly: true,
};

exports.cookieToken = (user, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: 604800, //7 days
	});

	user._doc.password = undefined;
	user._doc.createdAt = undefined;
	user._doc.updatedAt = undefined;
	user._doc.token = token;

	// sending token as a cookie in response
	res.status(201).cookie("token", token, options).json({
		status: "success",
		data: { user },
	});
};
