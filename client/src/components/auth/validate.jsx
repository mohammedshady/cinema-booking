export const validateSignUp = (values, setFormErrors) => {
	const {
		email,
		password,
		confirmPassword,
		name,
		mobile_no,
		gender,
		birth_date,
	} = values;

	const errors = {};

	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
	if (!email) errors.email = "Email is required";
	if (password !== confirmPassword) {
		errors.password = "Password does not match";
		errors.confirmPassword = "Password does not match";
	}
	if (password.length < 6) {
		errors.password = "Password must be 6 characters long";
		errors.confirmPassword = "Password must be 6 characters long";
	}
	if (!password) {
		errors.password = "Password is required";
		errors.confirmPassword = "Password is required";
	}
	if (!name) errors.name = "Name is required";
	if (!gender) errors.gender = "Gender is required";
	if (mobile_no.length < 11) errors.mobile_no = "Invalid phone number";
	if (!mobile_no) errors.mobile_no = "Phone is required";
	if (!birth_date) errors.birth_date = "Birthdate is required";
	else {
		let [year, month, day] = birth_date.split("-");
		day = day.split("T")[0];
		const dateObject = new Date(year, month - 1, day);
		if (
			dateObject.getFullYear() != year ||
			dateObject.getMonth() + 1 != month ||
			dateObject.getDate() != day ||
			year > 2050
		)
			errors.birth_date = "Incorrect date";
	}

	setFormErrors(errors);

	return Object.keys(errors).length > 0 ? false : true;
};

export const validateLogIn = (values, setFormErrors) => {
	const { email, password } = values;

	const errors = {};

	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (!email) errors.email = "Email is required";
	else if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
	if (!password) errors.password = "Password is required";

	setFormErrors(errors);

	return Object.keys(errors).length > 0 ? false : true;
};

export const validateResetPassword = (values, activeStep, formErrors, setFormErrors) => {
	const { email, newPassword, date_of_birth } = values;

	const errors = {};

	if (activeStep === 0) {
		const emailRegex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!emailRegex.test(email)) errors.email = "Please enter a valid email";
		if (!email) errors.email = "Email is required";
	}

	if (activeStep === 1) {
		if (!date_of_birth) errors.date_of_birth = "birthdate is required";
		else {
			let [year, month, day] = birth_date.split("-");
			day = day.split("T")[0];
			const dateObject = new Date(year, month - 1, day);
			if (
				dateObject.getFullYear() != year ||
				dateObject.getMonth() + 1 != month ||
				dateObject.getDate() != day ||
				year > 2050
			)
				errors.birth_date = "Incorrect date";
		}
	}

	if (activeStep === 2) {
		if (newPassword.length < 6)
			errors.newPassword = "Password must be 6 characters long";
		if (!newPassword) errors.newPassword = "Password is required";
	}

	for (let item in formErrors) {
		if (formErrors[item]) {
			return false;
		}
	}

	setFormErrors(errors);

	return Object.keys(errors).length > 0 ? false : true;
};
