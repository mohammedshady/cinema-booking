import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { useRef } from "react";
import axios from "axios";

// components
import Navbar from "../Navbar";
import "./HomeMovieDetails.css";
import Date from "../util/Date";
import Loader from "../util/Loader";
import ArrayString from "../util/ArrayString";
import Rating from "@mui/material/Rating";
import Time from "../util/Time";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { getDates } from "./claen/Calender";
import NoItem from "../util/NoItem";

// Create an array of weekdays starting from today

const initialState = {
  movie: {},
  shows: {},
  totalShows: {},
};
const initialState2 = {
  shows: {},
  movies: [],
};

let filteredMovies = [];
const HomeMovieDetails = () => {
  const myRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(initialState);
  const [state, setState] = useState(initialState2);
  const [loading, setLoading] = useState(true);

  const { movie, shows, totalShows } = data;

  const {
    _id,
    title,
    images,
    description,
    trailer_link,
    release_date,
    language,
    duration,
    genre,
    actors,
    status,
  } = movie;

  useEffect(() => {
    axios
      .get(`/api/movies/${id}`)
      .then((res) => {
        setData((prev) => ({ ...prev, ...res.data.data }));
        setLoading(false);
        //add related movies fetch
      })
      .catch((err) => {
        if (err?.response?.status == 403) navigate("/login");
        else notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });

    axios
      .get("/api/movies")
      .then((res) => {
        setState((prev) => ({ ...prev, ...res.data.data }));
      })
      .catch(
        (error) =>
          dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" }) //handle this
      );
  }, []);
  if (loading) return <Loader msg="loading" />;

  const relatedMovies = state.movies.filter((movie) => {
    for (let i = 0; i < movie.genre.length; i++) {
      if (genre.includes(movie.genre[i]) && movie._id !== _id) {
        return true;
      }
    }
    return false;
  });
  console.log(relatedMovies);

  const daysArray = getDates(shows);

  return (
    <>
      <Navbar />
      <div className="movie-details-container">
        <div className="movie-details-img-banner">
          <img src={movie.images.banner} alt="movie-image" />
        </div>
        <div className="movie-details-inner-container">
          <div className="movie-details-img-poster">
            <img
              src={movie.images.poster}
              alt="movie-image"
              className="poster-img"
            />
            <div className="movie-details-text ">
              <div className="entry-info">
                {<div className="movie-desc-title">{movie.title}</div>}

                <div className="duration-container">{`${parseInt(
                  duration / 60
                )}h, ${parseInt(duration % 60)}m`}</div>
              </div>
              <div className="movie-desc-secondary">
                <p className="movie-desc-release">
                  <span>released on</span>
                  <Date date={release_date} />
                </p>
                <p className="movie-desc-language">
                  <span>Languages</span>
                  <ArrayString arr={language} />
                </p>
                <p className="movie-desc-genre">
                  <span>Genre</span>
                  <ArrayString arr={genre} />
                </p>
                <p className="movie-desc-cast">
                  <span>Cast</span>
                  <ArrayString arr={actors} />
                </p>
                <div className="rating-container">
                  <Rating name="read-only" value={4} readOnly />
                </div>
                <div className="movie-controls">
                  {status === "released" ? (
                    <button
                      className="movie-details-sec-btn"
                      onClick={() =>
                        myRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                      }
                    >
                      Book Now !
                    </button>
                  ) : (
                    <div className="movie-details-sec-btn">UnReleased</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="movie-desc-container">
            <p className="movie-description-title">Movie Description</p>
            <p className="movie-desc-desc">{movie.description}</p>
          </div>
          <div className="movie-show-times-container" ref={myRef}>
            <p className="movie-description-title">Show Times</p>
            <div className="show-date-times-container">
              {daysArray.length > 0 ? (
                daysArray.map((date) => {
                  console.log(daysArray);
                  return (
                    <div className="show-date-container">
                      <div className="show-date-day">
                        <Date date={date.day} noyear />
                      </div>
                      <div className="show-time-chip-container">
                        {date.showTimes.map((showtime) => (
                          <span
                            className="show-time-chip"
                            onClick={(e) =>
                              navigate(`/shows/seat-map/${showtime.id}`)
                            }
                          >
                            <Time time={showtime.startTime} />
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <NoItem item={"Found no Recent Shows for This Movie"} />
              )}
            </div>
          </div>
          <div className="third-section">
            <div className="movie-cards-header">More of This..</div>
            <div className="movie-cards">
              {relatedMovies.length > 0 ? (
                relatedMovies.map((movie) => (
                  <div className="movie-card-container" key={movie.title}>
                    <img
                      src={movie.images.poster}
                      className="movie-card-img"
                    ></img>
                    <div className="movie-title">{movie.title}</div>
                  </div>
                ))
              ) : (
                <NoItem item={"found no related Movies"} />
              )}
              <button className="see-more-button">
                <ArrowForwardIosOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeMovieDetails;
