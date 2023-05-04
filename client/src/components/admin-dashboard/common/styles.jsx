export const styles = {
	global: {
		"& label.Mui-focused": {
			color: "white",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "white",
		},
		"& .MuiOutlinedInput-root": {
			"&.Mui-focused fieldset": {
				borderColor: "#d0d0d0",
			},
		},
		width: 1,
	},
	file: {
		"& label.Mui-focused": {
			color: "#ffffffb3",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "white",
		},
		"& .MuiOutlinedInput-root": {
			"&.Mui-focused fieldset": {
				border: "1px solid #525252",
			},
			"&:hover fieldset": {
				borderColor: "white",
			},
		},
		width: 1,
	},
	button: {
		width: 1,
		background: "#d0d0d0",
		color: "#131a21",
		"&:hover": {
			backgroundColor: " #909090",
		},
	},
	fileButton: {
		mr: "10px",
		background: "#d0d0d0",
		color: "#131a21",
		"&:hover": {
			backgroundColor: " #909090",
		},
	},
};
