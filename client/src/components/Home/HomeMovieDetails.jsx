import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";

// components
import Navbar from "../Navbar";
import "./HomeMovieDetails.css";
import Date from "../util/Date";
import Loader from "../util/Loader";
import ArrayString from "../util/ArrayString";
import Rating from "@mui/material/Rating";
import Time from "../util/Time";

import { getDates } from "./claen/Calender";

// Create an array of weekdays starting from today

const initialState = {
  movie: {},
  shows: {},
  totalShows: {},
};

const HomeMovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(initialState);
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
  }, []);
  if (loading) return <Loader msg="loading" />;

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
                      onClick={(e) => {
                        navigate();
                      }}
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
          <div className="movie-show-times-container">
            <p className="movie-description-title">Show Times</p>
            <div>
              {daysArray.map((date) => {
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
              })}
            </div>
          </div>
          <div></div>
        </div>

        {/* <div className="third-section">
          <div className="movie-cards-header">More of This..</div>
          <div className="movie-cards">
            {[1, 2, 3, 4, 5, 6].map((x) => (
              <div className="movie-card-container" key={x}>
                <div className="movie-card-img"></div>
                <div className="movie-title">{x}</div>
              </div>
            ))}
            <button className="see-more-button">
              <ArrowForwardIosOutlinedIcon />
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default HomeMovieDetails;
