import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Loader from "../../util/Loader";
import Table from "../common/Table";

const tableHeaderCells = [
	{
		id: "name",
		label: "Name",
	},
	{
		id: "email",
		label: "Email",
	},
	{
		id: "seats",
		label: "Seats",
	},
	{
		id: "movie",
		label: "Movie",
	},
	{
		id: "dateTime",
		label: "Show Time",
	},
	{
		id: "screenName",
		label: "Screen",
	},
];

const Bookings = () => {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchBookings = () => {
		axios
			.get(`/api/admin/bookings`)
			.then((res) => {
				setBookings(res.data.data.bookings);
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	const deleteBookings = (ids) => {
		setLoading(true);
		axios
			.delete(`/api/admin/bookings?bookingIds=${ids.join(",")}`)
			.then(() => {
				fetchBookings();
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<Table
			data={bookings}
			tableTitle="Bookings"
			headCells={tableHeaderCells}
			navigate={navigate}
			searchBy="name"
			showHeader
			showCheckBox
			showSort
			onDelete={deleteBookings}
		/>
	);
};
export default Bookings;
