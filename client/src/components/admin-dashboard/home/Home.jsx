import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Title from "../common/Title";
import Grid from "@mui/material/Grid";
import Card from "../common/Card";
import Container from "@mui/material/Container";
import Chart from "react-apexcharts";
import Table from "../common/Table";
import Loader from "../../util/Loader";

const initialState = {
	totalUsers: 0,
	totalMovies: 0,
	totalShows: 0,
	totalTicketSales: 0,
	movieTitles: [],
	bookingCounts: [],
	messages: [],
};

const headCells = [
	{
		id: "message",
		label: "",
	},
];

const AdminDashboard = () => {
	const [data, setData] = useState(initialState);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const {
		totalUsers,
		totalMovies,
		totalShows,
		totalTicketSales,
		movieTitles,
		bookingCounts,
		messages,
	} = data;

	const fetchDashboardData = () => {
		axios
			.get(`/api/admin/`)
			.then((res) => {
				setData((prev) => ({
					...prev,
					...res.data.data,
				}));
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	useEffect(() => {
		fetchDashboardData();
	}, [totalUsers, totalMovies, totalShows, totalTicketSales]);

	if (loading) return <Loader msg="loading" />;

	return (
		<>
			<Title title="Dashboard" />

			<Container>
				{/* Cards */}
				<Grid
					container
					sx={{ p: "24px" }}
					rowSpacing={4.5}
					columnSpacing={2.75}
				>
					<Grid item xs={12} sm={6} md={3} lg={3}>
						<Card value={totalMovies} title="Movies" />
					</Grid>
					<Grid item xs={12} sm={6} md={3} lg={3}>
						<Card value={totalShows} title="Shows" />
					</Grid>
					<Grid item xs={12} sm={6} md={3} lg={3}>
						<Card value={totalUsers} title="Users" />
					</Grid>
					<Grid item xs={12} sm={6} md={3} lg={3}>
						<Card value={totalTicketSales} title="Ticket Sales" />
					</Grid>

				{/* Table */}
					<Grid item xs={12} sm={12} md={6} lg={6}>
						<Table
							data={messages}
							tableTitle="Recent Activity"
							headCells={headCells}
							noTitle
						/>
					</Grid>

					{/* Bar Chart */}
					<Grid item xs={12} sm={12} md={6} lg={6}>
						<Chart
							options={{
								chart: {
									type: "bar",
									height: 365,
									toolbar: {
										show: false,
									},
									borderRadius: 4,
									background: "#1e1e1e",
								},
								title: {
									style: { fontSize: 20, fontWeight: 400 },
									text: "Booked Tickets",
									align: "center",
								},
								plotOptions: {
									bar: {
										columnWidth: "45%",
										borderRadius: 4,
									},
								},
								colors: ["#f0f0f0"],
								dataLabels: {
									enabled: false,
								},
								theme: { mode: "dark" },
								xaxis: {
									categories: movieTitles,
									axisBorder: {
										show: false,
									},
									axisTicks: {
										show: false,
									},
								},
								grid: {
									show: false,
								},
							}}
							series={[{ name: "value", data: bookingCounts }]}
							type="bar"
							height={483}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default AdminDashboard;
