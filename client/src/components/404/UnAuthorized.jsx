import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/hooks";

const UnAuthorized = () => {
	const navigate = useNavigate();
	const { user } = useAuthState();

const handleClick = () => {
	user?.role === 0 ? navigate("/") : navigate("/admin");
}

	return (
		<Container
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<Box
				component={"div"}
				sx={{
					textAlign: "center",
					fontWeight: 900,
					fontSize: "13.75rem",
					lineHeight: 1,
					marginBottom: `calc(1.5rem * 1.5)`,
					color: "#373a40",
				}}
			>
				403
			</Box>
			<Typography
				variant="h1"
				gutterBottom
				sx={{
					fontFamily: `Greycliff CF,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`,
					textAlign: "center",
					fontWeight: 900,
					fontSize: "2.375rem",
					color: "#c1c2c5",
				}}
			>
				Access Denied!
			</Typography>
			<Typography
				variant="body1"
				gutterBottom
				color="dimmed"
				size="lg"
				align="center"
				sx={{
					maxWidth: "31.25rem",
					margin: "auto",
					marginTop: "1.5rem",
					marginBottom: `calc(1.5rem * 1.5)`,
					color: "#909296",
				}}
			>
				You are not authorized to access this page. Please check your login
				credentials or contact the administrator for access.
			</Typography>
			<Container
				sx={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<Button
					onClick={handleClick}
					sx={{
						border: "1px solid #525252",
						color: "white",
						"&:hover": {
							backgroundColor: "#1976d20a",
							border: "1px solid white",
						},
					}}
					variant="outlined"
				>
					Take me back to home page
				</Button>
			</Container>
		</Container>
	);
};

export default UnAuthorized;
