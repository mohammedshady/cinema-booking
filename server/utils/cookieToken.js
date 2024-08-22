const jwt = require("jsonwebtoken");

const options = {
<<<<<<< HEAD
  expires: new Date(Date.now() + 60 * 60 * 1000),
  httpOnly: true,
};

exports.cookieToken = (user, res, rememberMe) => {
  const expiresIn = rememberMe ? "24h" : "1h";
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn, // expires in 1 hours or 24 if remember me is checked
  });
=======
	expires: new Date(Date.now() + 60 * 60 * 1000),
	httpOnly: true,
};

exports.cookieToken = (user, res, rememberMe) => {
	const expiresIn = rememberMe ? "24h" : "1h";
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn, // expires in 1 hours or 24 if remember me is checked
	});
>>>>>>> 520cb8a66fba6fdd96612a4fb5ed56da3800b8ef

  // remove sensitive data from the user object.
  user._doc.password = undefined;
  user._doc.createdAt = undefined;
  user._doc.updatedAt = undefined;
  user._doc.token = token;

<<<<<<< HEAD
  if (rememberMe) {
    options.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  res.status(201).cookie("token", token, options).json({
    status: "success",
    data: { user },
  });
=======
	if (rememberMe) {
		options.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
	}

	res.status(201).cookie("token", token, options).json({
		status: "success",
		data: { user },
	});
>>>>>>> 520cb8a66fba6fdd96612a4fb5ed56da3800b8ef
};
