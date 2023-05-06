import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { styles } from "./styles";

const ComboBox = (props) => {
	const { name, label, value, onChange, error, options, item } = props;

	return (
		<TextField
			name={name}
			select
			label={label}
			value={value}
			required
			sx={styles.global}
			onChange={onChange}
			error={error}
			helperText={error}
		>
			{options.map((option) => (
				<MenuItem key={option._id || option} value={option._id || option}>
					{option[item] || option}
				</MenuItem>
			))}
		</TextField>
	);
};

export default ComboBox;
