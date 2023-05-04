import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import { validateMovieInput } from "../common/validate";
import Loader from "../../util/Loader";
import Form from "../common/Form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import { Date } from "../common/DateTime";
import { styles } from "../common/styles";
import InputAdornment from "@mui/material/InputAdornment";
import MultipleSelect from "../common/MultipleSelect";
import Buttons from "../common/Buttons";

const initialFormData = {
	title: "",
	description: "",
	actors: [],
	poster: null,
	banner: null,
	release_date: null,
	duration: "",
	language: [],
	genre: [],
	rating: "",
};

const MovieForm = (props) => {
	const [formData, setFormData] = useState(initialFormData);
	const [formErrors, setFormErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const navigate = useNavigate();

	const populateFormFields = () => {
		props.update &&
			axios
				.get(`/api/admin/movies/populate/${id}`)
				.then((res) => {
					setFormData((prev) => ({
						...prev,
						...res.data.data.movie,
						poster: res.data.data.movie.images.poster,
						banner: res.data.data.movie.images.banner,
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
		populateFormFields();
	}, []);

	const handleChange = (e) => {
		setFormErrors({ ...formErrors, [e.target.name]: "" });

		e.target.type == "file"
			? setFormData({ ...formData, [e.target.name]: e.target.files[0] })
			: setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCancel = () => {
		navigate("/admin/movies");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let uploadData = new FormData();

		if (!validateMovieInput(formData, setFormErrors)) return;

		for (let key in formData) {
			if (
				(key == "poster" && typeof key == "object") ||
				(key == "banner" && typeof key == "object")
			)
				uploadData.set(key, formData[key], formData[key].name);
			else uploadData.set(key, formData[key]);
		}

		setLoading(true);
		props.update
			? axios
					.patch(`/api/admin/movies/${id}`, uploadData)
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
					.post(`/api/admin/movies`, uploadData)
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
			title={props.update ? "Update Movie" : "Add New Movie"}
			onSubmit={handleSubmit}
		>
			{/* Movie Title */}
			<TextField
				name="title"
				label="Title"
				value={formData.title}
				sx={styles.global}
				onChange={handleChange}
				required
				error={formErrors.title}
				helperText={formErrors.title}
			/>

			{/* Movie Description */}
			<TextField
				name="description"
				label="Description"
				value={formData.description}
				multiline
				sx={styles.global}
				onChange={handleChange}
				required
				error={formErrors.description}
				helperText={formErrors.description}
			/>

			{/* Cast */}
			<Autocomplete
				name="actors"
				multiple
				options={[]}
				freeSolo
				value={formData.actors}
				onChange={(e, value) => {
					setFormData({ ...formData, actors: value });
				}}
				renderTags={(value, getTagProps) =>
					value.map((option, index) => (
						<Chip label={option} {...getTagProps({ index })} />
					))
				}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Cast"
						placeholder="Enter an actor"
						onChange={() => setFormErrors({ ...formErrors, actors: "" })}
						error={formErrors.actors}
						helperText={formErrors.actors}
						sx={styles.global}
						required
						onBlur={(e) => {
							e.target.value &&
								!formData.actors.includes(e.target.value) &&
								setFormData({
									...formData,
									actors: [...formData.actors, e.target.value],
								});
						}}
					/>
				)}
				clearOnBlur
			/>

			{/* Rating */}
			<TextField
				name="rating"
				select
				label="Rating"
				value={formData.rating}
				required
				sx={styles.global}
				onChange={handleChange}
				error={formErrors.rating}
				helperText={formErrors.rating}
			>
				{[1, 2, 3, 4, 5].map((option) => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				))}
			</TextField>

			<Stack direction="row" spacing={2}>
				{/* Poster */}
				<TextField
					label="Poster"
					sx={styles.file}
					required
					placeholder={!formData.poster && "No File Selected"}
					value={formData.poster ? "File Selected" : ""}
					error={formErrors.poster}
					helperText={formErrors.poster}
					focused
					InputProps={{
						readOnly: true,
						startAdornment: (
							<InputAdornment>
								<Button
									sx={styles.fileButton}
									variant="contained"
									component="label"
								>
									Select file
									<Input
										name="poster"
										onChange={handleChange}
										inputProps={{ accept: "image/*" }}
										sx={{ display: "none" }}
										type="file"
									/>
								</Button>
							</InputAdornment>
						),
					}}
				/>

				{/* Banner */}
				<TextField
					label="Banner"
					sx={styles.file}
					required
					error={formErrors.banner}
					helperText={formErrors.banner}
					placeholder={!formData.banner && "No File Selected"}
					value={formData.banner ? "File Selected" : ""}
					focused
					InputProps={{
						readOnly: true,
						startAdornment: (
							<InputAdornment>
								<Button
									sx={styles.fileButton}
									variant="contained"
									component="label"
								>
									Select file
									<Input
										name="banner"
										onChange={handleChange}
										inputProps={{ accept: "image/*" }}
										sx={{ display: "none" }}
										type="file"
									/>
								</Button>
							</InputAdornment>
						),
					}}
				/>
			</Stack>
			<Stack direction="row" spacing={2}>
				{/* Date Picker */}
				<Date
					formData={formData}
					formErrors={formErrors}
					setFormData={setFormData}
					setFormErrors={setFormErrors}
				/>

				{/* Duration */}
				<TextField
					label="Duration"
					name="duration"
					sx={styles.global}
					value={formData.duration}
					onChange={handleChange}
					type="number"
					InputProps={{
						endAdornment: (
							<InputAdornment position="start">mins</InputAdornment>
						),
					}}
					required
					error={formErrors.duration}
					helperText={formErrors.duration}
				/>
			</Stack>

			{/* Languages */}
			<Stack direction="row" spacing={2} sx={{ minHeight: 79 }}>
				<MultipleSelect
					value={formData.language}
					label="Languages"
					setValue={(value) => {
						setFormData({ ...formData, language: value });
						setFormErrors({ ...formErrors, language: "" });
					}}
					options={languages}
					sx={styles.global}
					error={formErrors.language}
					helperText={formErrors.language}
				/>

				{/* Genres */}
				<MultipleSelect
					value={formData.genre}
					label="Genres"
					setValue={(value) => {
						setFormData({ ...formData, genre: value });
						setFormErrors({ ...formErrors, genre: "" });
					}}
					options={movieGenres}
					sx={styles.global}
					error={formErrors.genre}
					helperText={formErrors.genre}
				/>
			</Stack>

			{/* Buttons */}
			<Buttons update={props.update} handleCancel={handleCancel} />
		</Form>
	);
};

const languages = [
	"English",
	"Arabic",
	"Spanish",
	"German",
	"French",
	"Italian",
	"Russian",
	"Japanese",
	"Korean",
];

const movieGenres = [
	"Action",
	"Adventure",
	"Comedy",
	"Drama",
	"Horror",
	"Romance",
	"Science Fiction",
	"Fantasy ",
	"Thriller",
	"Animation",
	"Crime",
];

export default MovieForm;
