import Title from "./Title";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const Form = (props) => {
	const { title, onSubmit } = props;

	return (
		<>
			<Title title={title} />

			<Container maxWidth="md">
				<Paper
					sx={{
						width: "100%",
						borderRadius: "8px",
						p: 5.75,
						mt: 7,
					}}
				>
					<Box
						component="form"
						autoComplete="off"
						onSubmit={onSubmit}
						noValidate
					>
						<Stack
							sx={{
								"& > * + *": {
									mt: "5.5px!important",
								},
							}}
						>
							{props.children}
						</Stack>
					</Box>
				</Paper>
			</Container>
		</>
	);
};

export default Form;
