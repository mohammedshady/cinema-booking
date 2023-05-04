import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import { validateScreenInput } from "../common/validate";
import Loader from "../../util/Loader";
import Form from "../common/Form";
import TextField from "@mui/material/TextField";
import { styles } from "../common/styles";
import Buttons from "../common/Buttons";

const initialFormData = {
	totalColumns: "",
	totalRows: "",
	screenName: "",
};

const ScreenForm = (props) => {
	const [formData, setFormData] = useState(initialFormData);
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	const populateFormFields = () => {
		props.update &&
			axios
				.get(`/api/admin/screens/populate/${id}`)
				.then((res) => {
					setFormData((prev) => ({ ...prev, ...res.data.data.screen }));
					setLoading(false);
				})
				.catch((err) => {
					if (err?.response?.status == 403) navigate("/login");
					else notify(err?.response?.data?.message || err.toString());
					!err.toString().includes("Network Error") && setLoading(false);
				});
	};

	useEffect(() => {
		populateFormFields();
	}, []);

	const handleChange = (e) => {
		setFormErrors({ ...formErrors, [e.target.name]: "" });
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCancel = () => {
		navigate("/admin/screens");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validateScreenInput(formData, setFormErrors)) return;

		setLoading(true);
		props.update
			? axios
					.patch(`/api/admin/screens/${id}`, formData)
					.then(() => {
						setLoading(false);
						handleCancel();
					})
					.catch((err) => {
						if (err?.response?.status == 403) navigate("/login");
						else notify(err?.response?.data?.message || err.toString());
						!err.toString().includes("Network Error") && setLoading(false);
					})
			: axios
					.post(`/api/admin/screens`, formData)
					.then(() => {
						setLoading(false);
						handleCancel();
					})
					.catch((err) => {
						if (err?.response?.status == 403) navigate("/login");
						else notify(err?.response?.data?.message || err.toString());
						!err.toString().includes("Network Error") && setLoading(false);
					});
	};

	if (loading) return <Loader msg="loading" />;

	return (
		<Form title="Add a Screen" onSubmit={handleSubmit}>
			{/* Screen Name */}
			<TextField
				name="screenName"
				label="Screen Name"
				sx={styles.global}
				value={formData.screenName}
				onChange={handleChange}
				required
				error={formErrors.screenName}
				helperText={formErrors.screenName}
			/>

			{/* Total Columns */}
			<TextField
				name="totalColumns"
				label="Columns"
				required
				sx={styles.global}
				type="number"
				value={formData.totalColumns}
				onChange={handleChange}
				error={formErrors.totalColumns}
				helperText={formErrors.totalColumns}
				inputProps={{
					min: "7",
					max: "40",
				}}
			/>

			{/* Total Rows */}
			<TextField
				name="totalRows"
				label="Rows"
				type="number"
				required
				sx={styles.global}
				value={formData.totalRows}
				onChange={handleChange}
				error={formErrors.totalRows}
				helperText={formErrors.totalRows}
				inputProps={{
					min: "7",
					max: "40",
				}}
			/>

			{/* Buttons */}
			<Buttons update={props.update} handleCancel={handleCancel} />
		</Form>
	);
};

export default ScreenForm;
