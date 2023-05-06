import { useState, useEffect, useReducer } from "react";
import axios from "axios";

// components
import HomeMovieCard from "./HomeMovieCard";
import Navbar from "../Navbar";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";
import "./HomeMovies.css";
import HomeMovieList from "./HomeMovieList";
import MovieReviewCard from "./MovieReviewCard";

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

const HomeMovies = () => {
  const [moviesType, setMoviesType] = useState("Released");
  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, error, movies } = state;

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

  const recentComingSoonMovie = movies.find(
    (movie) =>
      movie.status === "coming soon" &&
      Date.parse(movie.release_date) >= Date.now()
  );

  if (error) return <Loader msg="error" />;
  else if (loading) return <Loader msg="loading" />;

  const DisplayMovies = ({ movies, heading }) => (
    <>
      <div className="movie-cards">
        {movies.map((movie, index) => (
          <HomeMovieCard movie={movie} key={index} />
        ))}
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="home-main-page">
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
          {/* <p className="welcome-msg-hdr">Browse Movies</p>
          <p className="welcome-msg-text">
            Book a Movie To watch in our greatest cinemas with high quality
          </p>
          <div className="chip-selectors-container">
            <button className="chip-selector">Available</button>
            <button className="chip-selector">Coming Soon</button>
            <button className="chip-selector">Amazing</button>
          </div> */}
        </div>
        <div className="movies-home-page">
          {movies.length > 0 ? (
            <>
              <div className="movies-container">
                <div className="home-movie-cards-ac">
                  <div className="home-movie-cards-bar-container">
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
                      <DisplayMovies movies={releasedMovies} heading="" />
                    ) : null
                  ) : comingSoonMovies.length > 0 ? (
                    <DisplayMovies
                      movies={comingSoonMovies}
                      heading="Coming Soon"
                    />
                  ) : null}
                </div>
                {/* <div className="movies-leaderheader-container">
                  <div className="movies-leaderboard-header">
                    Browse by Category
                  </div>
                  <div className="movies-leaderboard-container">
                    <HomeMovieList
                      heading={"Action"}
                      movies={movies.filter((movie) =>
                        movie.genre.includes("Action")
                      )}
                    ></HomeMovieList>
                    <HomeMovieList
                      heading={"Comedy"}
                      movies={movies.filter((movie) =>
                        movie.genre.includes("Comedy")
                      )}
                    ></HomeMovieList>
                    <HomeMovieList
                      heading={"Horror"}
                      movies={movies.filter((movie) =>
                        movie.genre.includes("Horror")
                      )}
                    ></HomeMovieList>
                  </div>
                </div> */}
                <div className="exclusive-coming-soon-movie">
                  <div className="coming-soon-movie-container">
                    {/* <img src={""} alt="" /> */}
                    <div className="coming-soon-movie-details"></div>
                  </div>
                </div>
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

export default HomeMovies;
