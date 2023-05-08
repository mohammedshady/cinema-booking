import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import { validateMovieInput } from "../common/validate";
import Loader from "../../util/Loader";
import Form from "../common/Form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ComboBox from "../common/ComboBox";
import MultiInput from "../common/MultiInput";
import FileUpload from "../common/FileUpload";
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

  const { update } = props;

  const populateFormFields = () => {
    update &&
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
    update
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
      title={update ? "Update Movie" : "Add New Movie"}
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
      <MultiInput
        name="actors"
        label="Cast"
        placeholder="Enter an actor"
        value={formData.actors}
        setFormData={setFormData}
        error={formErrors.actors}
        setFormErrors={setFormErrors}
      />

      {/* Rating */}
      <ComboBox
        name="rating"
        label="Rating"
        value={formData.rating}
        onChange={handleChange}
        error={formErrors.rating}
        options={[1, 2, 3, 4, 5]}
      />

      <Stack direction="row" spacing={2}>
        {/* Poster */}
        <FileUpload
          label="Poster"
          value={formData.poster}
          name="poster"
          error={formErrors.poster}
          onChange={handleChange}
        />

        {/* Banner */}
        <FileUpload
          label="Banner"
          value={formData.banner}
          name="banner"
          error={formErrors.banner}
          onChange={handleChange}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        {/* Release Date */}
        <Date
          name="release_date"
          label="Release Date"
          value={formData.release_date}
          error={formErrors.release_date}
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

      <Stack direction="row" spacing={2} sx={{ minHeight: 79 }}>
        {/* Languages */}
        <MultipleSelect
          value={formData.language}
          label="Languages"
          setFormData={setFormData}
          setFormErrors={setFormErrors}
          name="language"
          options={languages}
          error={formErrors.language}
        />

        {/* Genres */}
        <MultipleSelect
          value={formData.genre}
          label="Genres"
          setFormData={setFormData}
          setFormErrors={setFormErrors}
          name="genre"
          options={movieGenres}
          error={formErrors.genre}
        />
      </Stack>

      {/* Buttons */}
      <Buttons update={update} handleCancel={handleCancel} />
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
