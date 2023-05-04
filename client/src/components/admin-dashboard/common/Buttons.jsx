import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { styles } from "./styles";

const Buttons = (props) => {
	const { update, handleCancel } = props;

	return (
		<Stack direction="row" spacing={2}>
			{/* Back Button */}
			<Button variant="contained" sx={styles.button} onClick={handleCancel}>
				<KeyboardReturnIcon sx={{ m: "0 5px" }} /> Back
			</Button>

			{/* Add/Update Button */}
			<Button type="submit" variant="contained" sx={styles.button}>
				{update ? (
					<>
						<DesignServicesOutlinedIcon sx={{ m: "0 5px" }} /> Update
					</>
				) : (
					<>
						<FileUploadOutlinedIcon sx={{ m: "0 5px" }} /> Add
					</>
				)}
			</Button>
		</Stack>
	);
};

export default Buttons;
