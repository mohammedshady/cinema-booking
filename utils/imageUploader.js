const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.uploadToLocal = async (file, folderName, banner = true) => {
	const timestamp = Date.now().toString();

	let buffer;

	if (banner) {
		// banner_image=944 * 472
		buffer = await sharp(file.data)
			.resize({ height: 472, width: 944, fit: "contain" })
			.toBuffer();
	} else {
		// poster_image = 261 * 392 ;
		buffer = await sharp(file.data)
			.resize({ height: 392, width: 261, fit: "contain" })
			.toBuffer();
	}

	const uploadPath = path.join(__dirname, "../uploads", folderName);
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath, { recursive: true });
	}

	const extension = path.extname(file.name);
	const newName = timestamp + extension;
	const filePath = path.join(uploadPath, newName);
	fs.writeFileSync(filePath, buffer);

	const relativePath = path.join("/", folderName, newName);
	return relativePath;
};
