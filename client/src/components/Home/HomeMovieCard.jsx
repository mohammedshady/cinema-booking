import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./HomeMovieCard.css";
import InImageRating from "./InImageRating";

const HomeMovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      className="movie-card-container"
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
        <div className="in-image-details">
          <p className="in-image-header">{movie.title}</p>
          {isHovered ? <InImageRating rating={movie.rating} /> : null}
        </div>
      </div>
    </div>
  );
};

export default HomeMovieCard;
