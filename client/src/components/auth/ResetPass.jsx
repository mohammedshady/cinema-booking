import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../util/Loader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Date } from "../admin-dashboard/common/DateTime";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styles } from "../admin-dashboard/common/styles";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { validateResetPassword } from "./validate";

const initialFormData = {
	email: "",
	date_of_birth: null,
	newPassword: "",
};

const ResetPass = () => {
	const [formData, setFormData] = useState(initialFormData);
	const [formErrors, setFormErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const navigate = useNavigate();
	const maxSteps = 3;

	const handleChange = (e) => {
		setFormErrors({ ...formErrors, [e.target.name]: "" });
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateResetPassword(formData, activeStep, formErrors, setFormErrors))
			return;

		if (activeStep === maxSteps - 1) {
			setLoading(true);

			axios
				.post("api/user/resetPassword", formData)
				.then(() => {
					setLoading(false);
					window.location.replace("/");
				})
				.catch((err) => {
					const message = err.response.data.message;
					if (message.includes("mail")) {
						setActiveStep(0);
						setFormErrors((prev) => ({ ...prev, email: message }));
					}
					if (message.includes("date")) {
						setActiveStep(1);
						setFormErrors((prev) => ({ ...prev, date_of_birth: message }));
					}
					!err.toString().includes("Network Error") && setLoading(false);
				});
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	if (loading) return <Loader msg="loading" />;

	const titles = [
		"Forgot your password?",
		"Enter your birthdate",
		"Enter a new password",
	];

	return (
		<Container
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				maxWidth: "500px!important",
			}}
		>
			<Paper
				sx={{
					width: "100%",
					borderRadius: "8px",
					p: 5.75,
					mt: 7,
					backgroundColor: "unset",
				}}
			>
				<Box
					component="form"
					autoComplete="off"
					onSubmit={handleSubmit}
					noValidate
				>
					<Stack spacing={1}>
						{/* Titles */}

						<Typography
							variant={"h1"}
							sx={{
								fontSize: "2rem",
								textAlign: "center",
								fontWeight: "bold",
								m: "1rem 0px 3.125rem",
							}}
						>
							{titles[activeStep]}
						</Typography>

						{/* Email address */}

						{activeStep === 0 && (
							<TextField
								name="email"
								label="Email address"
								value={formData.email}
								sx={styles.global}
								onChange={handleChange}
								required
								autoComplete="on"
								error={formErrors.email}
								helperText={formErrors.email}
							/>
						)}

						{/* Birth Date */}

						{activeStep === 1 && (
							<Date
								name="date_of_birth"
								label="Birth Date"
								value={formData.date_of_birth}
								error={formErrors.date_of_birth}
								setFormData={setFormData}
								setFormErrors={setFormErrors}
							/>
						)}

						{/* New password */}

						{activeStep === 2 && (
							<TextField
								name="newPassword"
								label="Password"
								type={showPassword ? "text" : "password"}
								InputProps={{
									endAdornment: (
										<InputAdornment position="start">
											<IconButton onClick={handleClickShowPassword} edge="end">
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
								value={formData.newPassword}
								sx={styles.global}
								autoComplete="on"
								onChange={handleChange}
								required
								error={formErrors.newPassword}
								helperText={formErrors.newPassword}
							/>
						)}

						<Stack
							direction={"row"}
							alignItems={"center"}
							justifyContent={"space-between"}
						>
							{/* Back to login */}
							<Typography
								variant="body2"
								sx={{ fontSize: "0.75rem", lineHeight: "unset" }}
							>
								<Link
									underline="hover"
									sx={{ cursor: "pointer" }}
									onClick={() => navigate("/login")}
								>
									<KeyboardBackspaceIcon
										sx={{ mr: "3px", width: "0.7em", height: "0.7em" }}
									/>
									Back to the login page
								</Link>
							</Typography>

							{/* Next button */}

							<Button
								size="small"
								type="submit"
								sx={{ fontSize: "1rem", textTransform: "unset" }}
							>
								{activeStep !== 2 ? "Next" : "Reset password"}
								{activeStep !== 2 ? <KeyboardArrowRight /> : null}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPass;
