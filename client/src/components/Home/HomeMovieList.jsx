import React from "react";
import HomeMovieListItem from "./HomeMovieListItem";
import "./HomeMovieList.css";

const HomeMovieList = ({ heading, movies }) => {
  return (
    <div className="movies-leaderboard-list-container">
      <p className="movies-leaderboard-list-p">{heading}</p>
      <div className="movies-leaderboard-list-ibtn">
        <div className="movies-leaderboard-list">
          {movies
            ? movies.map((movie) => {
                return <HomeMovieListItem movie={movie} />;
              })
            : null}
        </div>
        <button className="list-btn">See More..</button>
      </div>
    </div>
  );
};
export default HomeMovieList;
