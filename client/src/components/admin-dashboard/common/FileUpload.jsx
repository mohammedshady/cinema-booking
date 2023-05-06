import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { styles } from "./styles";
import InputAdornment from "@mui/material/InputAdornment";

const FileUpload = (props) => {
	const { label, value, name, error, onChange } = props;

	return (
		<TextField
			label={label}
			sx={styles.file}
			required
			placeholder={!value && "No File Selected"}
			value={value ? "File Selected" : ""}
			error={error}
			helperText={error}
			focused
			InputProps={{
				readOnly: true,
				startAdornment: (
					<InputAdornment>
						<Button
							sx={styles.fileButton}
							variant="contained"
							component="label"
						>
							Select file
							<Input
								name={name}
								onChange={onChange}
								inputProps={{ accept: "image/*" }}
								sx={{ display: "none" }}
								type="file"
							/>
						</Button>
					</InputAdornment>
				),
			}}
		/>
	);
};

export default FileUpload;
