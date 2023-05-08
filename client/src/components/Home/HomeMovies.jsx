import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// components
import MovieCard from "../movie/MovieCard";
import Navbar from "../navBar/Navbar";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";
import "./HomeMovies.css";
import MovieReviewCard from "./MovieReviewCard";
import Footer from "../footer/Footer";
import ComingSoonMovie from "./ComingSoonMovie";

const initialState = {
  loading: true,
  error: null,
  movies: [],
};
//removereducer 2
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

const HomeMovies = () => {
  const navigate = useNavigate();
  const [moviesType, setMoviesType] = useState("Released");
  const [state, dispatch] = useReducer(reducer, initialState);
  const moviesRef = useRef(null);
  const ratedMoviesRef = useRef(null);

  const { loading, movies } = state;

  const clickHandler = (e) => {
    setMoviesType(e.target.textContent);
  };

  const fetchMovies = async () => {
    axios
      .get("/api/user/movies")
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
  let topRatedMovies = movies?.filter((movie) => movie.rating == 5);
  let comingSoonMovies = movies?.filter((movie) => movie.status !== "released");

  const recentComingSoonMovie = movies?.find(
    (movie) =>
      movie.status === "coming soon" &&
      Date.parse(movie.release_date) >= Date.now()
  );

  if (loading) return <Loader msg="loading" />;

  const DisplayMovies = ({ movies }) => {
    const visibleMovies = movies.length <= 8 ? movies : movies.slice(0, 8);
    console.log(movies.length);
    return (
      <>
        <div className="movie-cards">
          {visibleMovies.map((movie, index) => (
            <MovieCard movie={movie} key={index} />
          ))}
        </div>
        {movies.length > 8 ? (
          <button
            className="see-more-movies-home-btn"
            onClick={() => navigate("/movies")}
          >
            See More
          </button>
        ) : null}
      </>
    );
  };

  return (
    <div>
      <Navbar position={"absolute"} />
      {Object.keys(recentComingSoonMovie).length > 0 ? (
        <ComingSoonMovie
          recentComingSoonMovie={recentComingSoonMovie}
          moviesRef={moviesRef}
          ratedMoviesRef={ratedMoviesRef}
        />
      ) : (
        <NoItem item={"There isnt any Coming Soon Movies"} />
      )}
      <div className="movies-home-page">
        {movies.length > 0 ? (
          <>
            <div className="movies-container">
              <div className="home-movie-cards-ac">
                <div className="home-movie-cards-bar-container" ref={moviesRef}>
                  <h1 className="home-movie-cards-bar-header">
                    Discover Movies
                  </h1>
                  <ul className="home-movie-cards-bar">
                    <li
                      className={`home-movie-cards-bar-item ${
                        moviesType === "Released" ? "active-bar-item" : ""
                      }`}
                      onClick={clickHandler}
                    >
                      Released
                    </li>
                    <li
                      className={`home-movie-cards-bar-item ${
                        moviesType === "Released" ? "" : "active-bar-item"
                      }`}
                      onClick={clickHandler}
                    >
                      Coming Soon
                    </li>
                  </ul>
                </div>

                {moviesType === "Released" ? (
                  releasedMovies.length > 0 ? (
                    <DisplayMovies movies={releasedMovies} />
                  ) : null
                ) : comingSoonMovies.length > 0 ? (
                  <DisplayMovies movies={comingSoonMovies} />
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="">
            <NoItem item={"4 0 4 no movies Found"} />
          </div>
        )}
      </div>
      <div className="home-main-page" ref={ratedMoviesRef}>
        <div className="welcome-home-page">
          {topRatedMovies.length > 0 ? (
            <>
              <p className="movie-top-rated-header">
                Top rated movies in our cinema
              </p>
              {topRatedMovies.length > 0 ? (
                <MovieReviewCard data={topRatedMovies} />
              ) : null}
            </>
          ) : (
            <NoItem item={"Found no Top Rated Movies"} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeMovies;
