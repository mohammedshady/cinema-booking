import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { styles } from "./styles";

const MultipleSelect = (props) => {
	const { value, setFormData, setFormErrors, options, error, label, name } =
		props;

	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		typeof value === "string"
			? setFormData((prev) => ({ ...prev, [name]: value.split(",") }))
			: setFormData((prev) => ({ ...prev, [name]: value }));
		setFormErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<FormControl sx={styles.global} error={error}>
			<InputLabel required id={label}>
				{label}
			</InputLabel>

			<Select
				labelId={label}
				id={`${label}Id`}
				multiple
				value={value}
				onChange={handleChange}
				input={<OutlinedInput id={label} label={label} />}
				renderValue={(selected) => (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				MenuProps={{
					PaperProps: {
						sx: {
							maxHeight: 224,
							width: 250,
						},
					},
				}}
			>
				{options.map((option) => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				))}
			</Select>

			<FormHelperText>{error}</FormHelperText>
		</FormControl>
	);
};

export default MultipleSelect;
