import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import StyleIcon from "@mui/icons-material/Style";
import TextsmsIcon from "@mui/icons-material/Textsms";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MovieIcon from "@mui/icons-material/Movie";
import { useNavigate } from "react-router-dom";
import { logout, useAuthDispatch, useAuthState } from "../../context";
import { useLocation } from "react-router-dom";
import steveImage from "../../assets/images/steve.jpg";

const pages = [
  { name: "Home", path: "/" },
  { name: "Movies", path: "/movies" },
  { name: "About", path: "/about" },
];
const settings = [
  { name: "My Bookings", icon: <StyleIcon />, path: "/bookings" },
  { name: "Give Feedback", icon: <TextsmsIcon />, path: "/feedback" },
  { name: "Logout", icon: <LogoutIcon />, path: "/" },
];

function Navbar({ position }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user } = useAuthState();
  const location = useLocation();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position={position === "absolute" ? "absolute" : "static"}
      sx={{
        background: "unset",
        backgroundImage:
          "linear-gradient(to top,rgba(0, 0, 0, 0.01) 0%,rgba(0, 0, 0, 0.9) 90%,rgb(13 17 23 / 98%) 100%)",
        boxShadow: "unset",
        padding: "20px 40px 0px 40px",
      }}
    >
      <Toolbar disableGutters>
        <MovieIcon
          sx={{ display: { xs: "none", md: "flex" }, mr: 1, fontSize: 42 }}
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        ></Typography>

        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
            <MenuIcon />
          </IconButton>
          <Menu
            disableScrollLock={true}
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
              "& ul": { backgroundColor: "#161924" },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.name}
                onClick={() => {
                  navigate(page.path);
                  setAnchorElNav(null);
                }}
              >
                <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <MovieIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        ></Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Button
              key={page.name}
              onClick={() => navigate(page.path)}
              sx={{
                borderBottom:
                  location.pathname === page.path
                    ? { borderBottom: "2px solid white" }
                    : null,
                borderRadius: 0,
                padding: "20px 40px",
                color: "white",
                display: "block",
                textTransform: "unset",
                "&:hover": {
                  backgroundColor: "unset",
                  borderBottom: "2px solid white",
                },
              }}
              style={{ margin: 0 }}
            >
              {page.name}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          {user != null ? (
            <Button
              onClick={handleOpenUserMenu}
              sx={{
                borderRadius: "50%",
                color: "white",
                border: "3px solid white",
                fontSize: "1.4rem",
                width: "50px",
                height: "50px",
                minWidth: 0,
                padding: 0,
              }}
            >
              <img
                src={steveImage}
                style={{ borderRadius: "50%", width: 45, height: 45 }}
              ></img>
              {/* {user.email[0].toUpperCase()} */}
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")}>Login</Button>
          )}
          <Menu
            disableScrollLock={true}
            sx={{ mt: "45px", "& ul": { backgroundColor: "#161924" } }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting.name}
                onClick={() => {
                  setting.name === "Logout" && logout(dispatch);
                  navigate(setting.path);
                  setAnchorElUser(null);
                }}
              >
                <Typography textAlign="center">
                  {setting.icon} {setting.name}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
