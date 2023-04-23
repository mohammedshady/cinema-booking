const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			select: [false, "password is required"],
		},
		fname: {
			type: String,
			required: false,
		},
		lname: {
			type: String,
			required: false,
		},
		sex: {
			type: String,
			enum: ["male", "female", "other"],
			required: false,
		},
		mobileno: {
			type: String,
			required: false,
		},
		date_of_birth: {
			type: Date,
			required: false,
		},
		role: {
			type: Number,
			default: 0,
			select: false,
			// 0 => normal user
			// 1 => application admin
		},
		resetPasswordToken: {
			type: String,
			required: false,
			select: false,
		},
		resetPasswordExpires: {
			type: Date,
			required: false,
			select: false,
		},
	},
	{ timestamps: true, versionKey: false }
);

// Encrypt password before save
userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

// check for password validation in login
userSchema.methods.isValidatedPassword = async function (passwordToCheck) {
	return await bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", userSchema);

// Check if default user already exists
User.findOne({ email: "admin@gmail.com" }, (err, existingUser) => {
	if (err) {
		console.error(err);
		return;
	}

	if (existingUser) {
		console.log("Default user already exists");
		return;
	}

	// Create default user
	const defaultUser = new User({
		email: "admin@gmail.com",
		password: "admin",
		fname: "Admin",
		lname: "User",
		sex: "other",
		mobileno: "1234567890",
		date_of_birth: new Date("1990-01-01"),
		role: 1, // 1 => application admin (cinema)
	});

	// Save default user to database
	defaultUser.save((err, user) => {
		if (err) {
			console.error(err);
		} else {
			console.log("Default user created");
		}
	});
});

module.exports = User;
