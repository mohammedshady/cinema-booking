import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../admin-dashboard/common/notify";
import Loader from "../util/Loader";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styles } from "../admin-dashboard/common/styles";
import { validateLogIn } from "./validate";

const initialFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

const Login = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: "" });
    e.target.name === "rememberMe"
      ? setFormData({ ...formData, [e.target.name]: e.target.checked })
      : setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogIn(formData, setFormErrors)) return;

    setLoading(true);

    axios
      .post(`/api/user/login`, formData)
      .then((res) => {
        setLoading(false);
        const user = res?.data?.data?.user;
        user.role == 1
          ? window.location.replace("/admin")
          : window.location.replace("/");
      })
      .catch((err) => {
        notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });
  };

  if (loading) return <Loader msg="loading" />;

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
          <Stack spacing={3}>
            {/* Title */}

            <Typography
              variant={"h1"}
              sx={{
                fontSize: "2.5rem",
                textAlign: "center",
                fontWeight: "bold",
                m: "1rem 0px 3.125rem",
              }}
            >
              Welcome back!
            </Typography>

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

            <Box>
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

              <Stack
                direction={"row"}
                sx={{ mt: "-8px" }}
                alignItems={"center"}
                justifyContent={"space-around"}
              >
                {/* Remember me */}

                <FormControlLabel
                  sx={{ "& span": { fontSize: "0.875rem" } }}
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      size="small"
                    />
                  }
                  label="Remember me"
                />

                {/* Forget password */}

                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ textAlign: "center", lineHeight: "unset", m: 0 }}
                >
                  <Link
                    underline="hover"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/resetPassword")}
                  >
                    Forgot password?
                  </Link>
                </Typography>
              </Stack>
            </Box>

            {/* Log in */}

            <Button type="submit" variant="contained" sx={styles.button}>
              Login
            </Button>

            <Box>
              {/* Sign up */}

              <Stack direction={"row"} justifyContent={"center"} spacing={1}>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: "#c1c2c5" }}
                >
                  Don't have an account?
                </Typography>

                <Link
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
