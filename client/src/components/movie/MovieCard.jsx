import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./MovieCard.css";
import InImageRating from "./InImageRating";
import StarIcon from "@mui/icons-material/Star";

const MovieCard = ({ movie, withTitle }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  //display details on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      className={withTitle ? "movie-card-container-sm" : "movie-card-container"}
      onClick={() => navigate(`/movies/details/${movie._id}`)}
    >
      <div
        className="movie-card-inner-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          className="movie-card-img"
          src={movie.images.poster}
          alt={movie.title}
        />
        {!withTitle ? (
          <div className="in-image-details">
            <p className="in-image-header">{movie.title}</p>
            {isHovered ? <InImageRating rating={movie.rating} /> : null}
          </div>
        ) : (
          <div className="movie-out-image-details">
            <span className="movie-card-title-span">{movie.title}</span>
            <span className="movie-card-rating-number">
              <span>{movie.rating}</span>
              <span>
                <StarIcon color={"warning"} fontSize={"medium"} />
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
