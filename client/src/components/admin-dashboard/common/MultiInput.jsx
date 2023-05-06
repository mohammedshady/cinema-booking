import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { styles } from "./styles";

const MultiInput = (props) => {
	const {
		value,
		setFormData,
		error,
		setFormErrors,
		name,
		label,
		placeholder,
	} = props;

	const handleChange = (e, value) => {
		const trimmedValue = value
			.filter((item) => item.trim() !== "")
			.map((item) => item.trim());
		setFormData((prev) => ({ ...prev, [name]: trimmedValue }));
	};

	const handleBlur = (e) => {
		e.target.value.trim() &&
			!value.includes(e.target.value) &&
			setFormData((prev) => ({
				...prev,
				[name]: [...prev[name], e.target.value],
			}));
	};

	const handleErrorClear = () => {
		setFormErrors((prev) => ({ ...prev, [name]: "" }));
	};

	return (
		<Autocomplete
			name={name}
			multiple
			options={[]}
			freeSolo
			value={value}
			onChange={handleChange}
			renderTags={(value, getTagProps) =>
				value.map((option, index) => (
					<Chip label={option} {...getTagProps({ index })} />
				))
			}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					placeholder={placeholder}
					onChange={handleErrorClear}
					error={error}
					helperText={error}
					sx={styles.global}
					required
					onBlur={handleBlur}
				/>
			)}
			clearOnBlur
		/>
	);
};

export default MultiInput;
