import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styles } from "./styles";

export const Date = (props) => {
	const { value, setFormData, setFormErrors, error, name, label } = props;

	const handleChange = (value) => {
		value !== null &&
			setFormData((prev) => ({
				...prev,
				[name]: `${value.$y}-${value.$M + 1}-${value.$D}`,
			}));
		setFormErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label={label}
				value={value}
				inputFormat="DD-MM-YYYY"
				onChange={handleChange}
				renderInput={(params) => (
					<TextField
						required
						sx={styles.global}
						helperText={error}
						{...params}
						error={error}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};

export const DateTime = (props) => {
	const { value, setFormData, setFormErrors, error, name, label } = props;

	const handleChange = (value) => {
		value !== null &&
			setFormData((prev) => ({
				...prev,
				[name]: value.$d,
			}));
		setFormErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DateTimePicker
				label={label}
				value={value}
				inputFormat="DD-MM-YYYY hh:mm A"
				onChange={handleChange}
				renderInput={(params) => (
					<TextField
						required
						sx={styles.global}
						{...params}
						error={error}
						helperText={error}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};
