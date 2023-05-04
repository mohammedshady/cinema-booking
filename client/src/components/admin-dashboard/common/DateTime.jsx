import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styles } from "./styles";

export const Date = (props) => {
	const { formData, formErrors, setFormData, setFormErrors } = props;
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker
				label="Release Date"
				value={formData.release_date}
				inputFormat="DD-MM-YYYY"
				onChange={(value) => {
					value !== null &&
						setFormData({
							...formData,
							release_date: `${value.$y}-${value.$M + 1}-${value.$D}`,
						});
					setFormErrors({ ...formErrors, release_date: "" });
				}}
				renderInput={(params) => (
					<TextField
						required
						sx={styles.global}
						helperText={formErrors.release_date}
						{...params}
						error={formErrors.release_date}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};

export const DateTime = (props) => {
	const { formData, formErrors, setFormData, setFormErrors } = props;
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DateTimePicker
				label="Show Date & Time"
				value={formData.dateTime}
				inputFormat="DD-MM-YYYY hh:mm A"
				onChange={(value) => {
					value !== null &&
						setFormData({
							...formData,
							dateTime: value.$d,
						});
					setFormErrors({ ...formErrors, dateTime: "" });
				}}
				renderInput={(params) => (
					<TextField
						required
						sx={styles.global}
						{...params}
						error={formErrors.dateTime}
						helperText={formErrors.dateTime}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};
