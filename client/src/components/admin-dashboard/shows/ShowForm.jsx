import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import { validateShowInput } from "../common/validate";
import Loader from "../../util/Loader";
import Form from "../common/Form";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
		props.update &&
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
		props.update
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
			title={props.update ? "Update Show" : "Add New Show"}
			onSubmit={handleSubmit}
		>
			{/* Movie */}
			<TextField
				select
				label="Movie"
				name="movie"
				value={formData.movie}
				required
				sx={styles.global}
				onChange={handleChange}
				error={formErrors.movie}
				helperText={formErrors.movie}
			>
				{formData.movies.map((option) => (
					<MenuItem key={option._id} value={option._id}>
						{option.title}
					</MenuItem>
				))}
			</TextField>

			{/* Screen Name */}
			<TextField
				select
				label="Screen"
				name="screen"
				value={formData.screen}
				required
				sx={styles.global}
				onChange={handleChange}
				error={formErrors.screen}
				helperText={formErrors.screen}
			>
				{formData.screens.map((option) => (
					<MenuItem key={option._id} value={option._id}>
						{option.screenName}
					</MenuItem>
				))}
			</TextField>

			{/* Date Time Picker */}
			<DateTime
				formData={formData}
				formErrors={formErrors}
				setFormData={setFormData}
				setFormErrors={setFormErrors}
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
			<Buttons update={props.update} handleCancel={handleCancel} />
		</Form>
	);
};

export default ShowForm;
