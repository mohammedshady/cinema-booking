const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.uploadToLocal = async (file, folderName, banner = true) => {
	const timestamp = Date.now().toString();

	let buffer;

	if (banner) {
		// Banner Image : 1920 x 1080
		buffer = await sharp(file.data)
			.resize({ height: 1080, width: 1920, fit: "contain" })
			.toBuffer();
	} else {
		// Poster Image : 261 x 392
		buffer = await sharp(file.data)
			.resize({ height: 392, width: 261, fit: "contain" })
			.toBuffer();
	}

	// create the upload directory if it doesn't exist.
	const uploadPath = path.join(__dirname, "../uploads", folderName);
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	// generate a name for the uploaded image.
	const extension = path.extname(file.name);
	const newName = timestamp + extension;

	// write the file buffer to the file system.
	const filePath = path.join(uploadPath, newName);
	fs.writeFileSync(filePath, buffer);

	// return the relative path of the uploaded image.
	const relativePath = path.join("/", folderName, newName);
	return relativePath;
};
