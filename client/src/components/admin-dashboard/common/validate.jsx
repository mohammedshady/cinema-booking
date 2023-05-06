export const validateScreenInput = (values, setFormErrors) => {
	const { screenName, totalColumns, totalRows } = values;

	const errors = {};

	if (!screenName) errors.screenName = "Screen name is required";
	if (!totalColumns) errors.totalColumns = "Column number is required";
	if (!totalRows) errors.totalRows = "Row number is required";
	if (totalColumns < 8) errors.totalColumns = "Columns should be more than 8";
	if (totalRows < 8) errors.totalRows = "Rows should be more than 8";
	if (totalColumns > 20) errors.totalColumns = "Columns should be less than 20";
	if (totalRows > 20) errors.totalRows = "Rows should be less than 20";

	setFormErrors(errors);
	if (Object.keys(errors).length > 0) return false;
	return true;
};

export const validateMovieInput = (values, setFormErrors) => {
	const {
		title,
		description,
		actors,
		poster,
		banner,
		release_date,
		duration,
		language,
		genre,
		rating,
	} = values;

	const errors = {};

	if (!release_date) errors.release_date = "Release date is required";
	else {
		let [year, month, day] = release_date.split("-");
		day = day.split("T")[0];
		const dateObject = new Date(year, month - 1, day);
		if (
			dateObject.getFullYear() != year ||
			dateObject.getMonth() + 1 != month ||
			dateObject.getDate() != day ||
			year > 2050
		)
			errors.release_date = "Incorrect date";
	}
	if (!title) errors.title = "Title is required";
	if (!description) errors.description = "Description is required";
	if (!poster) errors.poster = "Poster is required";
	if (!banner) errors.banner = "Banner is required";
	if (!duration) errors.duration = "Movie duration is required";
	if (!rating) errors.rating = "Movie rating is required";
	if (actors.length === 0) errors.actors = "Cast is required";
	if (language.length === 0) errors.language = "Please select languages";
	if (genre.length === 0) errors.genre = "Please select genres";

	setFormErrors(errors);

	return Object.keys(errors).length > 0 ? false : true;
};

export const validateShowInput = (values, setFormErrors) => {
	const { movie, screen, price, dateTime } = values;

	const errors = {};

	if (!movie) errors.movie = "Movie is required";
	if (!screen) errors.screen = "Screen is required";
	if (!price) errors.price = "Price is required";
	if (!dateTime) errors.dateTime = "Date & Time is required";
	if (dateTime == "Invalid Date") errors.dateTime = "Invalid Date";

	setFormErrors(errors);
	if (Object.keys(errors).length > 0) return false;
	return true;
};
