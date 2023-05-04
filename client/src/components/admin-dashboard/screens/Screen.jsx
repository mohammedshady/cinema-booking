import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Loader from "../../util/Loader";
import Table from "../common/Table";

const tableHeaderCells = [
	{
		id: "screenName",
		label: "Screen Name",
	},
	{
		id: "totalSeats",
		label: "Total Seats",
	},
];

const Screens = () => {
	const [screens, setScreens] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchScreens = () => {
		axios
			.get(`/api/admin/screens`)
			.then((res) => {
				setScreens(res.data.data.screens);
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message  || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	useEffect(() => {
		fetchScreens();
	}, []);

	const deleteScreen = (ids) => {
		setLoading(true);
		axios
			.delete(`/api/admin/screens?screenIds=${ids.join(",")}`)
			.then(() => {
				fetchScreens();
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message  || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<Table
			data={screens}
			tableTitle="Screens"
			headCells={tableHeaderCells}
			searchBy="screenName"
			addLink="/admin/screens/add"
			navigate={navigate}
			showHeader
			showSort
			showCheckBox
			showEdit
			onDelete={deleteScreen}
		/>
	);
};

export default Screens;
