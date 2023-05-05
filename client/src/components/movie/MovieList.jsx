import React from "react";
import MovieListItem from "./MovieListItem";
import "./MovieList.css";

const MoviesList = ({ heading, movies }) => {
  return (
    <div className="movies-leaderboard-list-container">
      <p className="movies-leaderboard-list-p">{heading}</p>
      <div className="movies-leaderboard-list">
        {movies
          ? movies.map((movie) => {
              return <MovieListItem movie={movie} />;
            })
          : null}
      </div>
      <button className="list-btn">See More..</button>
    </div>
  );
};
export default MoviesList;
