import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieReviewCard.css";
import StarIcon from "@mui/icons-material/Star";
import BookIcon from "@mui/icons-material/Book";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrayString from "../util/ArrayString";

const MovieReviewCard = ({ data }) => {
  const ref = useRef(null);
  const newArr = data.map((item) => {
    return {
      ...item,
      shown: false,
    };
  });
  const [movies, setMovies] = useState(newArr);
  const navigate = useNavigate();

  //button scroll handler
  const scrollRight = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };
  const scrollLeft = (scrollOffset) => {
    ref.current.scrollLeft -= scrollOffset;
  };
  //toggle movie details
  const toggleItem = (index) => {
    setMovies((prev) =>
      prev.map((movie, i) => {
        if (i === index) {
          return { ...movie, visible: !movie.visible };
        } else if (movie.visible) {
          return { ...movie, visible: false };
        } else {
          return { ...movie, visible: false };
        }
      })
    );
    //handle scroll too
    const cardWidth = 350;
    const position =
      index * cardWidth + (cardWidth / 2 - window.innerWidth / 2) + 100;
    ref.current.scrollTo({
      top: 0,
      left: position,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="gallery-wrap">
        <div className="gallery-btn leftc">
          <button
            className="see-more-button"
            onClick={() => scrollLeft(300 * 5)}
          >
            <ArrowBackIosNewIcon />
          </button>
        </div>
        <div className="movie-gallery-wrapper" ref={ref}>
          <div className="movie-gallery-grid">
            {movies.map((movie, index) => (
              <span
                className={`movie-gallery-item ${
                  movie.visible ? "active" : "zoom-in"
                }`}
                key={index}
                name={index}
                onClick={(e) => {
                  //clearState();
                  toggleItem(index);
                }}
              >
                <div className="movie-gallery-item-img">
                  <img
                    src={"http://localhost:5000" + movie.images.poster}
                    className="movie-gallery-card-img"
                  />
                  <div className="movie-img-icon"></div>
                </div>
                {movie.visible ? (
                  <div className="movie-gallery-item-review">
                    <div className="movie-gallery-item-review-text">
                      <div className="movie-review-header">{movie.title}</div>
                      <div className="movie-review-details">
                        <div className="movie-review-description">
                          {movie.description}
                        </div>
                        <div className="movie-detail-item">
                          <div className="movie-review-duration contain">
                            <p className="detail-review-title">Duration</p>
                            <p>
                              {movie.duration}
                              {" min"}
                            </p>
                          </div>
                          <div className="movie-review-genre contain">
                            <p className="detail-review-title">Genres</p>
                            <p>
                              <ArrayString arr={movie.genre} />
                            </p>
                          </div>
                        </div>
                        <div className="movie-detail-item">
                          <div className="movie-review-duration contain">
                            <p className="detail-review-title">Status</p>
                            <p>{movie.status}</p>
                          </div>
                          <div className="movie-review-genre contain">
                            <p className="detail-review-title">Actors</p>
                            <p>
                              <ArrayString arr={movie.actors} />
                            </p>
                          </div>
                        </div>
                        <div className="movie-review-detail-btn">
                          <button
                            className="see-more-btn"
                            onClick={() =>
                              navigate(`/movies/details/${movie._id}`)
                            }
                          >
                            See More
                          </button>
                        </div>
                      </div>
                      <div className="movie-review-controls">
                        <div className="movie-review-language">
                          <p className="detail-review-title">Languages</p>
                          <p>
                            {movie.language.map((lang) => {
                              return (
                                <span className="movie-review-genre-item">
                                  {lang}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                        <div className="movie-review-rating">
                          <span className="movie-review-rating-number">
                            {movie.rating}
                          </span>
                          <span>
                            <StarIcon color={"warning"} style={{ margin: 0 }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </span>
            ))}
          </div>
        </div>
        <div className="gallery-btn rightc">
          <button
            className="see-more-button"
            onClick={() => scrollRight(300 * 5)}
          >
            <ArrowForwardIosOutlinedIcon />
          </button>
        </div>
      </div>
    </>
  );
};
export default MovieReviewCard;
