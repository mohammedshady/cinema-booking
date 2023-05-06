import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Loader from "../../util/Loader";
import Table from "../common/Table";

const tableHeaderCells = [
	{
		id: "email",
		label: "Email",
	},
	{
		id: "message",
		label: "Message",
	},
	{
		id: "date",
		label: "Date",
	},
];

const Feedbacks = () => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchFeedbacks = () => {
		axios
			.get(`/api/admin/feedback`)
			.then((res) => {
				setFeedbacks(res.data.data.feedbacks);
				setLoading(false);
			})
			.catch((err) => {
				if (err?.response?.status == 403) navigate("/login");
				else notify(err?.response?.data?.message  || err.toString());
				!err.toString().includes("Network Error") && setLoading(false);
			});
	};

	useEffect(() => {
		fetchFeedbacks();
	}, []);

	const deleteFeedbacks = (ids) => {
		setLoading(true);
		axios
			.delete(`/api/admin/feedback?ids=${ids.join(",")}`)
			.then(() => {
				fetchFeedbacks();
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
			data={feedbacks}
			tableTitle="Feedbacks"
			headCells={tableHeaderCells}
			navigate={navigate}
			searchBy="email"
			showHeader
			showCheckBox
			onDelete={deleteFeedbacks}
		/>
	);
};
export default Feedbacks;
