import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, useNavigate } from "react-router-dom";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DoorSlidingOutlinedIcon from "@mui/icons-material/DoorSlidingOutlined";
import { logout, useAuthDispatch } from "../../context";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export default function MiniDrawer() {
	const dispatch = useAuthDispatch();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton sx={{ color: "#9CA3AF" }} onClick={() => setOpen(!open)}>
						{open ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
				</DrawerHeader>

				<Divider sx={{ backgroundColor: "#9CA3AF" }} />

				<List sx={{ color: "#9CA3AF" }}>
					{[
						{
							name: "Movies",
							path: "/admin/movies",
							icon: <MovieFilterOutlinedIcon />,
						},
						{
							name: "Shows",
							path: "/admin/shows",
							icon: <TheatersOutlinedIcon />,
						},
						{
							name: "Screens",
							path: "/admin/screens",
							icon: <DoorSlidingOutlinedIcon />,
						},
						{
							name: "Feedbacks",
							path: "/admin/feedbacks",
							icon: <RateReviewOutlinedIcon />,
						},
						{ name: "Logout", path: "/", icon: <LogoutOutlinedIcon /> },
					].map((item, index) => (
						<ListItem key={index} disablePadding sx={{ display: "block" }}>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
								}}
								onClick={() => {
									item.name === "Logout" && logout(dispatch);
									navigate(item.path, { replace: true });
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										color: "#9CA3AF",
									}}
								>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.name}
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 0 }}>
				<Outlet />
			</Box>
		</Box>
	);
}
