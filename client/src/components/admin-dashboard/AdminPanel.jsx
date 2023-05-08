import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuthDispatch, logout } from "../../context";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/MovieFilter";
import ShowIcon from "@mui/icons-material/Theaters";
import ScreenIcon from "@mui/icons-material/DoorSliding";
import FeedbackIcon from "@mui/icons-material/RateReview";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Sidebar from "./common/Sidebar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const navItems = [
  { name: "Home", path: "/admin", icon: <HomeIcon /> },
  { name: "Movies", path: "/admin/movies", icon: <MovieIcon /> },
  { name: "Shows", path: "/admin/shows", icon: <ShowIcon /> },
  { name: "Screens", path: "/admin/screens", icon: <ScreenIcon /> },
  { name: "Feedbacks", path: "/admin/feedbacks", icon: <FeedbackIcon /> },
  { name: "Bookings", path: "/admin/bookings", icon: <AssignmentIcon /> },
  { name: "Users", path: "/admin/users", icon: <PeopleIcon /> },
  { name: "Logout", path: "/", icon: <LogoutIcon /> },
];

const AdminPanel = () => {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isItemSelected = (path) => {
    let normalizedLocationPath = location.pathname.replace(
      /\/(update|add).*$/,
      ""
    );
    normalizedLocationPath = normalizedLocationPath.endsWith("/")
      ? normalizedLocationPath.slice(0, -1)
      : normalizedLocationPath;

    return normalizedLocationPath === path;
  };

  const handleNavItemClick = (name, path) => {
    name === "Logout" && logout(dispatch);
    navigate(path);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar open={open} setOpen={setOpen}>
          <List
            sx={{
              color: "#9CA3AF",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 0,
            }}
          >
            {navItems.map((item, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  display: "block",
                  marginTop: item.name === "Logout" ? "auto" : 0,
                  backgroundColor: isItemSelected(item.path) && "#F3F4F6",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleNavItemClick(item.name, item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isItemSelected(item.path) ? "black" : "#9CA3AF",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: isItemSelected(item.path) ? "black" : "#9CA3AF",
                      "&.MuiListItemText-root span": {
                        fontWeight: isItemSelected(item.path) && "bold",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Sidebar>

        {/* Main Page */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPanel;
