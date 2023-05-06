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
		id: "mobileno",
		label: "Mobile Number",
	},
	{
		id: "dateTime",
		label: "Joined On",
	},
];

const Bookings = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchUsers = () => {
		axios
			.get(`/api/admin/users`)
			.then((res) => {
				setUsers(res.data.data.users);
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const deleteUsers = (ids) => {
		setLoading(true);
		axios
			.delete(`/api/admin/users?ids=${ids.join(",")}`)
			.then(() => {
				fetchUsers();
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
			data={users}
			tableTitle="Users"
			headCells={tableHeaderCells}
			navigate={navigate}
			searchBy="name"
			showHeader
			showCheckBox
			showSort
			onDelete={deleteUsers}
		/>
	);
};
export default Bookings;
