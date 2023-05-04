import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Title = (props) => {
	const { title } = props;
	return (
		<Box>
			<Typography sx={{ p: 2.75 }} variant="h5">
				{title}
			</Typography>
		</Box>
	);
};

export default Title;
