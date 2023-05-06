import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import { validateShowInput } from "../common/validate";
import Loader from "../../util/Loader";
import Form from "../common/Form";
import TextField from "@mui/material/TextField";
import ComboBox from "../common/ComboBox";
import { DateTime } from "../common/DateTime";
import Buttons from "../common/Buttons";
import { styles } from "../common/styles";

const initialState = {
	movies: [],
	screens: [],
	movie: "",
	screen: "",
	price: "",
	dateTime: null,
};

const ShowForm = (props) => {
	const [formData, setFormData] = useState(initialState);
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	const { update } = props;

	const populateFormCombobox = () => {
		axios
			.get(`/api/admin/shows/populate`)
			.then((res) => {
				setFormData((prev) => ({
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

	const populateFormFields = () => {
		update &&
			axios
				.get(`/api/admin/shows/populate/${id}`)
				.then((res) => {
					setFormData((prev) => ({
						...prev,
						...res.data.data.show,
						dateTime: res.data.data.show.date,
						movie: res.data.data.show.movie._id,
						screen: res.data.data.show.screen._id,
					}));
				})
				.catch((err) => {
					if (err?.response?.status == 403) navigate("/login");
					else notify(err?.response?.data?.message || err.toString());
					!err.toString().includes("Network Error") && setLoading(false);
				});
	};

	useEffect(() => {
		populateFormCombobox();
		populateFormFields();
	}, []);

	const handleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
		setFormErrors((prevState) => ({
			...prevState,
			[e.target.name]: "",
		}));
	};

	const handleCancel = () => {
		navigate("/admin/shows");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!validateShowInput(formData, setFormErrors)) return;

		setLoading(true);
		update
			? axios
					.patch(`/api/admin/show/${id}`, formData)
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
					.post(`/api/admin/show`, formData)
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
		<Form
			title={update ? "Update Show" : "Add New Show"}
			onSubmit={handleSubmit}
		>
			{/* Movie */}
			<ComboBox
				name="movie"
				label="Movie"
				value={formData.movie}
				onChange={handleChange}
				error={formErrors.movie}
				options={formData.movies}
				item="title"
			/>

			{/* Screen Name */}
			<ComboBox
				name="screen"
				label="Screen"
				value={formData.screen}
				onChange={handleChange}
				error={formErrors.screen}
				options={formData.screens}
				item="screenName"
			/>

			{/* Show Date & Time */}
			<DateTime
				value={formData.dateTime}
				error={formErrors.dateTime}
				name="dateTime"
				setFormData={setFormData}
				setFormErrors={setFormErrors}
				label="Show Date & Time"
			/>

			{/* Price */}
			<TextField
				label="Price"
				name="price"
				value={formData.price}
				sx={styles.global}
				onChange={handleChange}
				required
				error={formErrors.price}
				helperText={formErrors.price}
			/>

			{/* Buttons */}
			<Buttons update={update} handleCancel={handleCancel} />
		</Form>
	);
};

export default ShowForm;
