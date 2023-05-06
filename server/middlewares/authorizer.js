const CustomError = require("../utils/customError");

exports.authorizeRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new CustomError(
					"You do not have permission to access this resource",
					403
				)
			);
		}
		next();
	};
};
