import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../util/Loader";

const TopRatedSlider = ({ topRatedMovies }) => {
  const ref = useRef(null);
  const [clickCounter, setClickCounter] = useState(1);
  const navigate = useNavigate();

  const handleClick = (number) => {
    const totalPages = topRatedMovies.length;

    if (clickCounter + number < 1 || clickCounter + number > totalPages) {
      return;
    }

    scrollRightHandler(number * 250);
    setClickCounter(clickCounter + number);
  };

  const scrollRightHandler = (scrollOffset) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const totalPages = topRatedMovies.length;
      clickCounter < totalPages ? handleClick(1) : handleClick(-1);
    }, 8000);
    return () => clearInterval(interval);
  }, [clickCounter, topRatedMovies]);

  return (
    <div className="side-bar-filter-item">
      <p className="side-bar-filter-item-title">Top Rated</p>
      <div>
        <div className="rated-movies-scroll-container" ref={ref}>
          <div className="rated-movies-scroll">
            {topRatedMovies?.length > 0 ? (
              topRatedMovies.map((movie) => (
                <div
                  className="top-rated-filter-bar-img"
                  onClick={() => navigate(`details/${movie._id}`)}
                >
                  <div className="slider-movie-item">
                    <img
                      src={movie.images.banner}
                      className="slider-movie-image"
                    />
                    {/* <p className="slider-movie-title">{movie.title}</p> */}
                  </div>
                </div>
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
        <div className="rated-movies-scroll-controls">
          <div>
            <div>
              <span
                onClick={() => {
                  handleClick(-1);
                }}
              >
                {"<"}
              </span>
              <span
                onClick={() => {
                  handleClick(1);
                }}
              >
                {">"}
              </span>
            </div>
          </div>
          <span className="current-page-count">
            {clickCounter}/{topRatedMovies.length}
          </span>
        </div>
      </div>
    </div>
  );
};
export default TopRatedSlider;
