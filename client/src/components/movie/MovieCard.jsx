import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const [isShown, setIsShown] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="movie-card-container smaller-size"
      onClick={() => navigate(`details/${movie._id}`)}
    >
      <div className="movie-card-inner-container">
        <img
          className="movie-card-img"
          src={movie.images.poster}
          alt={movie.title}
        ></img>

        <p className="movie-card-title">
          {movie?.title?.length > 35
            ? `${movie?.title?.substr(0, 35)} . . .`
            : movie?.title}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
