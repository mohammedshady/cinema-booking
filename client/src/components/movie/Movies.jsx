import { useState, useEffect, useReducer } from "react";
import axios from "axios";

// components
import MovieCard from "./MovieCard";
import Navbar from "../Navbar";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";
import "./Movies.css";
import { Container, Stack } from "@mui/material";
import { TextField } from "@mui/material";
import ControlledOpenSelect from "./ControlledOpenSelect";
import { searchInMovies, sortByRating, sortAlphabetically } from "./helper";
import { Box } from "@mui/material";

const Movies = () => {
  const [moviesList, setMoviesList] = useState({ movies: [], totalMovies: 0 });
  const [searchKey, setSearchKey] = useState("");
  const [sortAlph, setSortAlph] = useState("Asc");
  const [sortRating, setSortRating] = useState("High");
  const [sortCategory, setSortCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    axios
      .get("/api/user/movies")
      .then((res) => {
        setMoviesList((prev) => ({
          ...prev,
          movies: res.data.data.movies,
          totalMovies: res.data.data.totalMovies,
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
    fetchMovies();
  }, []);

  const filteredMovies = searchInMovies(moviesList.movies, searchKey);
  const sortedMovies = sortAlphabetically(filteredMovies, sortAlph);

  if (loading) return <Loader msg="loading" />;

  const DisplayMovies = ({ movies, heading }) => (
    <>
      <p className="movie-heading">{heading}</p>
      <div className="movie-cards">
        {movies.map((movie, index) => (
          <MovieCard movie={movie} key={index} />
        ))}
      </div>
    </>
  );
  return (
    <>
      <Navbar />
      <div className="welcome-home-page">
        <div className="movies-home-page">
          <Container maxWidth="md">
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <TextField
                sx={{
                  "& label": {
                    color: "white",
                  },
                  "& .MuiSelect-iconOutlined": {
                    color: "white",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#d0d0d0",
                    },
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "white",
                  },
                }}
                fullWidth
                label="Search Movies Here"
                id="Search Movies Here"
                value={searchKey}
                size="small"
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
              ></TextField>

              <Stack
                width={1}
                spacing={1}
                direction={{ xs: "column", sm: "row" }}
              >
                <ControlledOpenSelect
                  options={{
                    title: "Rating",
                    arr: [
                      { name: "High to Low", value: "High" },
                      { name: "Low to High", value: "Low" },
                    ],
                  }}
                />
                <ControlledOpenSelect
                  options={{
                    title: "A to Z",
                    arr: [
                      { name: "", value: "none" },
                      { name: "Asc to Des", value: "Asc" },
                      { name: "Des to Asc", value: "Des" },
                    ],
                  }}
                  sortSet={setSortAlph}
                  sortOption={sortAlph}
                />
                <ControlledOpenSelect
                  options={{
                    title: "Category",
                    arr: [
                      { name: "Action", value: "Action" },
                      { name: "Comedy", value: "Comedy" },
                      { name: "Thriller", value: "Thriller" },
                      { name: "Horror", value: "Horror" },
                    ],
                  }}
                />
              </Stack>
            </Stack>
          </Container>

          {sortedMovies?.length > 0 ? (
            <>
              <div className="movies-container first-section">
                {sortedMovies.length > 0 ? (
                  <DisplayMovies movies={sortedMovies} />
                ) : null}
              </div>
            </>
          ) : (
            <div className="">
              <NoItem item={"4 0 4 no movies Found"} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Movies;
