import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../admin-dashboard/common/notify";
import { Date } from "../admin-dashboard/common/DateTime";
import Loader from "../util/Loader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styles } from "../admin-dashboard/common/styles";
import { validateSignUp } from "./validate";

const initialFormData = {
  name: "",
  email: "",
  mobile_no: "",
  gender: "",
  password: "",
  confirmPassword: "",
  birth_date: null,
};

const Signup = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    e.target.name === "confirmPassword"
      ? setFormErrors({ ...formErrors, confirmPassword: "", password: "" })
      : setFormErrors({ ...formErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  axios
    .post(`api/user/signup`, formData)
    .then((res) => {
      setLoading(false);
      const user = res?.data?.data?.user;
      if (user) window.location.replace("/");
    })
    .catch((err) => {
      notify(err?.response?.data?.message || err.toString());
      !err.toString().includes("Network Error") && setLoading(false);
    });
};

if (!validateSignUp(formData, setFormErrors)) return;

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
          {/* Title */}

          <Typography
            variant={"h1"}
            sx={{
              fontSize: "2rem",
              textAlign: "center",
              fontWeight: "bold",
              m: "1rem 0px 3.125rem",
            }}
          >
            Create an account
          </Typography>

          {/* Name */}

          <TextField
            name="name"
            label="Name"
            value={formData.name}
            sx={styles.global}
            onChange={handleChange}
            required
            autoComplete="on"
            error={formErrors.name}
            helperText={formErrors.name}
          />

          {/* Email Address */}

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

          {/* Password */}

          <TextField
            name="password"
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
            value={formData.password}
            sx={styles.global}
            autoComplete="on"
            onChange={handleChange}
            required
            error={formErrors.password}
            helperText={formErrors.password}
          />

          {/* Confirm password */}

          <TextField
            name="confirmPassword"
            label="Confirm Password"
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
            value={formData.confirmPassword}
            sx={styles.global}
            autoComplete="on"
            onChange={handleChange}
            required
            error={formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />

          <Stack direction={"row"} spacing={2}>
            {/* Phone Number */}

            <TextField
              label="Phone Number"
              name="mobile_no"
              sx={styles.global}
              value={formData.mobile_no}
              onChange={handleChange}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+20</InputAdornment>
                ),
              }}
              required
              error={formErrors.mobile_no}
              helperText={formErrors.mobile_no}
            />

            {/* Birth Date */}

            <Date
              name="birth_date"
              label="Birth Date"
              value={formData.birth_date}
              error={formErrors.birth_date}
              setFormData={setFormData}
              setFormErrors={setFormErrors}
            />
          </Stack>

          {/* Gender */}

          <FormControl error={formErrors.gender} sx={{ height: "65px" }}>
            <RadioGroup row sx={{ justifyContent: "center" }}>
              <FormControlLabel
                value="male"
                control={
                  <Radio
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    value="male"
                    name="gender"
                  />
                }
                sx={{ ml: 0 }}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={
                  <Radio
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    value="female"
                    name="gender"
                  />
                }
                sx={{ m: 0 }}
                label="Female"
              />
            </RadioGroup>
            <FormHelperText sx={{ textAlign: "center" }}>
              {formErrors.gender}
            </FormHelperText>
          </FormControl>

          {/* Sign up */}

          <Button type="submit" variant="contained" sx={styles.button}>
            Signup
          </Button>

          <Box>
            {/* Login */}

            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={1}
            >
              <Typography
                variant="body2"
                gutterBottom
                sx={{
                  color: "#c1c2c5",
                  textAlign: "center",
                  lineHeight: "unset",
                  m: 0,
                }}
              >
                Already have an account?
              </Typography>

              <Link
                underline="hover"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Link>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  </Container>
);

export default Signup;
