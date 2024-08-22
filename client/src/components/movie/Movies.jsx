import { useState, useEffect } from "react";
import axios from "axios";

// components
import MovieCard from "./MovieCard";
import Navbar from "../navBar/Navbar";
import Loader from "../util/Loader";
import "./Movies.css";
import { Stack } from "@mui/material/";
import { TextField } from "@mui/material";
import {
  searchInMovies,
  sortAlphabetically,
  filterByGenre,
  filterByLanguage,
  sortByRating,
  sortByStatus,
} from "../util/helperFunctions/sortMoviesFunctions";
import { Box } from "@mui/material";
import TopRatedSlider from "./TopRatedSlider";
import Footer from "../footer/Footer";

const Movies = () => {
  const [moviesList, setMoviesList] = useState({ movies: [], totalMovies: 0 });
  const [moviesStatus, setMoviesStatus] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [sortAlph, setSortAlph] = useState(false);
  const [sortRating, setSortRating] = useState(false);
  const [sortGenre, setSortGenre] = useState(movieGenres[0]);
  const [sortLanguage, setSortLanguage] = useState(languages[0]);
  const [loading, setLoading] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState([]);

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

  const toggleRatingSort = () => {
    setSortRating(!sortRating);
  };
  const toggleAlphSort = () => {
    setSortAlph(!sortAlph);
  };
  useEffect(() => {
    const currentMovies = sortByStatus(moviesList.movies, moviesStatus);
    const searchedMovies = searchInMovies(currentMovies, searchKey);
    const sortedMovies = sortAlphabetically(searchedMovies, sortAlph);
    const sortedByGenre = filterByGenre(sortedMovies, sortGenre);
    const sortedByLanguage = filterByLanguage(sortedByGenre, sortLanguage);
    const sortedByRating = sortByRating(sortedByLanguage, sortRating);

    setFilteredMovies(sortedByRating);
  }, [
    moviesList.movies,
    searchKey,
    sortAlph,
    sortGenre,
    sortLanguage,
    sortRating,
    moviesStatus,
  ]);

  const handleSoonClick = (e) => {
    if (moviesStatus === "coming soon") {
      setMoviesStatus("");
      return;
    }
    setMoviesStatus("coming soon");
  };

  const handleReleasedClick = (e) => {
    if (moviesStatus === "released") {
      setMoviesStatus("");
      return;
    }
    setMoviesStatus("released");
  };
  const topRatedMovies = moviesList?.movies.filter(
    (movie) => movie.rating == 5
  );

  if (loading) return <Loader msg="loading" />;

  const DisplayMovies = ({ movies, heading }) => (
    <>
      <div className="movie-cards">
        {movies.map((movie, index) => (
          <MovieCard movie={movie} key={index} withTitle />
        ))}
      </div>
    </>
  );
  return (
    <>
      <Navbar />
      <div className="movies-search-page">
        <div className="search-filter-movies-page">
          <div className="search-filter-bar-container">
            <div className="side-sort-btn-container">
              <button
                className={`rating-sort-check ${
                  sortRating ? "active-sort-btn" : ""
                }`}
                onClick={() => {
                  toggleRatingSort();
                }}
              >
                Rating
              </button>
              <button
                className={`asc-sort-check ${
                  sortAlph ? "active-sort-btn" : ""
                }`}
                onClick={() => {
                  toggleAlphSort();
                }}
              >
                Ascending
              </button>
            </div>
            <Stack
              width={1}
              spacing={1}
              direction={{ xs: "column", sm: "row" }}
            >
              <TextField
                sx={{
                  "& label": {
                    color: "white !important",
                  },
                  "& .MuiSelect-iconOutlined": {
                    color: "white !important",
                  },
                  "& .MuiInput-underline:after": {
                    borderBottomColor: "white",
                    color: "white !important",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#d0d0d0",
                    },
                    "& fieldset": {
                      borderColor: "#d0d0d0",
                      color: "white !important",
                    },
                  },
                  "& label.Mui-focused": {
                    color: "white !important",
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
            </Stack>
          </div>

          <div className="side-to-side-filter-movies">
            <Box
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              <div className="side-bar-filter-container">
                <div className="side-bar-filter-item side-sort-btn-container">
                  <button
                    className={`released-sort-check ${
                      moviesStatus === "released" ? "active-sort-btn" : ""
                    }`}
                    onClick={handleReleasedClick}
                  >
                    Released
                  </button>
                  <button
                    className={`soon-sort-check ${
                      moviesStatus === "coming soon" ? "active-sort-btn" : ""
                    }`}
                    onClick={handleSoonClick}
                  >
                    Soon
                  </button>
                </div>
                <div className="side-bar-filter-item">
                  <p className="side-bar-filter-item-title">Languages</p>
                  <div className="side-bar-filter-item-contents long-filter">
                    {languages.map((language) => {
                      const isActive = language === sortLanguage;
                      return (
                        <div
                          className={`language-option-filter ${
                            isActive ? "active-sort" : ""
                          }`}
                          key={language}
                          onClick={() => setSortLanguage(language)}
                        >
                          {language}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="side-bar-filter-item">
                  <p className="side-bar-filter-item-title">Genres</p>
                  <div className="side-bar-filter-item-contents long-filter">
                    {movieGenres.map((genre) => {
                      const isActive = genre === sortGenre;
                      return (
                        <div
                          className={`genre-option-filter ${
                            isActive ? "active-sort" : ""
                          }`}
                          key={genre}
                          onClick={() => setSortGenre(genre)}
                        >
                          {genre}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {topRatedMovies.length > 0 ? (
                  <TopRatedSlider topRatedMovies={topRatedMovies} />
                ) : (
                  <></>
                )}
              </div>
            </Box>
            <div className="filtered-searched-movies-big-container">
              {filteredMovies?.length > 0 ? (
                <>
                  <div className="movies-container searched-section-movies">
                    {filteredMovies.length > 0 ? (
                      <DisplayMovies movies={filteredMovies} />
                    ) : null}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const languages = [
  "All",
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
  "All",
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
export default Movies;
