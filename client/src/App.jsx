import { Routes, Route } from "react-router-dom";

// components
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeMovies from "./components/Home/HomeMovies";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup";
import Booking from "./components/Booking/Booking";
import Movies from "./components/movie/Movies";
import HomeMovieDetails from "./components/Home/HomeMovieDetails";
import Error404 from "./components/404/Error404";
import UnAuthorized from "./components/404/UnAuthorized";
import Shows from "./components/shows/Shows";
import Feedback from "./components/Feedback/Feedback";
import AdminPanel from "./components/admin-dashboard/AdminPanel";
import AdminMovies from "./components/admin-dashboard/movies/Movies";
import AdminShows from "./components/admin-dashboard/shows/Shows";
import AdminFeedback from "./components/admin-dashboard/feedback/Feedback";
import MovieForm from "./components/admin-dashboard/movies/MovieForm";
import ShowForm from "./components/admin-dashboard/shows/ShowForm";
import Screen from "./components/admin-dashboard/screens/Screen";
import ScreenForm from "./components/admin-dashboard/screens/ScreenForm";
import AdminHome from "./components/admin-dashboard/home/Home";
import ViewBookings from "./components/admin-dashboard/bookings/Bookings";
import ViewUsers from "./components/admin-dashboard/users/Users";
import SeatSelector from "./components/shows/SeatSelector";
import PrivateRoute from "./components/PrivateRoute";
import PersistLogin from "./components/PersistLogin";
import ResetPass from "./components/auth/ResetPass";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

const App = () => {
	return (
		<ThemeProvider theme={darkTheme}>
			<Routes>
				<Route element={<PersistLogin />}>
					{/* public routes */}
					<Route path="/" element={<HomeMovies />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/movies" element={<Movies />} />
					<Route path="/movies/details/:id" element={<HomeMovieDetails />} />
					<Route path="/shows/:id" element={<Shows />} />
					<Route path="/resetPassword" element={<ResetPass />} />

					{/* protected routes for user */}
					<Route element={<PrivateRoute allowedRoles={[0]} />}>
						<Route path="/shows/seat-map/:id" element={<SeatSelector />} />
						<Route path="/bookings" element={<Booking />} />
						<Route path="/feedback" element={<Feedback />} />
					</Route>

					{/* protected routes for admin */}
					<Route element={<PrivateRoute allowedRoles={[1]} />}>
						<Route path="/admin" element={<AdminPanel />}>
							<Route path="" element={<AdminHome />} />
							<Route path="movies" element={<AdminMovies />} />
							<Route path="movies/add" element={<MovieForm />} />
							<Route path="movies/update/:id" element={<MovieForm update />} />
							<Route path="shows" element={<AdminShows />} />
							<Route path="shows/add" element={<ShowForm />} />
							<Route path="shows/update/:id" element={<ShowForm update />} />
							<Route path="feedbacks" element={<AdminFeedback />} />
							<Route path="screens" element={<Screen />} />
							<Route path="screens/add" element={<ScreenForm />} />
							<Route
								path="screens/update/:id"
								element={<ScreenForm update />}
							/>
							<Route path="bookings" element={<ViewBookings />} />
							<Route path="users" element={<ViewUsers />} />
						</Route>
					</Route>

					{/* unauthorized */}
					<Route path="/unauthorized" element={<UnAuthorized />} />

					{/* 404 page */}
					<Route path="*" element={<Error404 />} />
				</Route>
			</Routes>
		</ThemeProvider>
	);
};

export default App;
