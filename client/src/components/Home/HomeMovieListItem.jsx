import React from "react";
import "./HomeMovieListItem.css";

const HomeMovieListItem = ({ movie }) => {
  return (
    <div className="movie-item">
      <div className="movie-img">
        <img src={movie.images.poster}></img>
      </div>
      <div className="movie-text">
        <p className="movie-text-title">{movie.title}</p>
        <p className="movie-text-desc">{movie.description.substr(0, 30)}...</p>
      </div>
      <div className="movie-attr-container">
        <div className="movie-attr">book</div>
      </div>
    </div>
  );
};
export default HomeMovieListItem;
