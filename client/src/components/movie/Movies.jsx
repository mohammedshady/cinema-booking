import { useState, useEffect, useReducer } from "react";
import axios from "axios";

// components
import MovieCard from "./MovieCard";
import Navbar from "../Navbar";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";
import "./Movies.css";
import { TextField } from "@mui/material";
import ControlledOpenSelect from "./ControlledOpenSelect";
import { sortAlphabetically } from "./helper";
import { searchInMovies } from "./helper";

const initialState = {
  loading: true,
  error: null,
  movies: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_SUCCESS":
      return { loading: false, error: "", movies: payload };
    case "FETCH_ERROR":
      return { ...state, error: payload };
    default:
      return state;
  }
};

const Movies = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [searchKey, setSearchKey] = useState("");
  const [sortAlph, setSortAlph] = useState("Asc");
  const [sortRating, setSortRating] = useState("High");
  const [sortCategory, setSortCategory] = useState("All");

  const { loading, error, movies } = state;

  const fetchMovies = async () => {
    axios
      .get("/api/movies")
      .then((res) => {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.movies });
      })
      .catch((error) =>
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" })
      );
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  let releasedMovies = movies?.filter((movie) => movie.status === "released");

  releasedMovies = searchInMovies(releasedMovies, searchKey);
  sortAlphabetically(releasedMovies, sortAlph);

  if (error) return <Loader msg="error" />;
  else if (loading) return <Loader msg="loading" />;
  console.log(movies);

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
          <div className="movies-filter-bar">
            <div className="filter-sort-item search-bar">
              <TextField
                fullWidth
                label="Search Movies Here"
                id="Search Movies Here"
                value={searchKey}
                size="small"
                onChange={(e) => {
                  setSearchKey(e.target.value);
                }}
              ></TextField>
            </div>
            <div className="filter-sort-item">
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
            </div>
          </div>
          {movies.length > 0 ? (
            <>
              <div className="movies-container first-section">
                {releasedMovies.length > 0 ? (
                  <DisplayMovies movies={releasedMovies} />
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
