import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import StyleIcon from "@mui/icons-material/Style";
import TextsmsIcon from "@mui/icons-material/Textsms";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";
import { logout, useAuthDispatch, useAuthState } from "../context";
import { useLocation } from "react-router-dom";

const pages = [
  { name: "Home", path: "/" },
  { name: "Movies", path: "/movies" },
  { name: "Search", path: "/movies" },
];
const settings = [
  { name: "My Bookings", icon: <StyleIcon />, path: "/bookings" },
  { name: "Give Feedback", icon: <TextsmsIcon />, path: "/feedback" },
  { name: "Logout", icon: <LogoutIcon />, path: "/" },
];

function ResponsiveAppBar() {
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
      position="absolute"
      sx={{
        background: "unset",
        backgroundImage:
          "linear-gradient(to top,rgba(0, 0, 0, 0.01) 0%,rgba(0, 0, 0, 0.9) 90%,rgb(13 17 23 / 98%) 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
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
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
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
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
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
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  borderBottom:
                    location.pathname === page.path
                      ? { borderBottom: "2px solid #3b82f6" }
                      : null,
                  borderRadius: 0,
                  padding: "20px 40px",
                  color: "white",
                  display: "block",
                  textTransform: "unset",
                  "&:hover": {
                    backgroundColor: "unset",
                    borderBottom: "2px solid #3b82f6",
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
                  border: "3px solid #3b82f6",
                  fontSize: "1.4rem",
                  width: "50px",
                  height: "50px",
                  minWidth: 0,
                }}
              >
                {user.email[0].toUpperCase()}
              </Button>
            ) : (
              <Button onClick={() => navigate("/login")}>Login</Button>
            )}
            <Menu
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
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
