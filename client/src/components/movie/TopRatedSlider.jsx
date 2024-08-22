import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../util/Loader";

const TopRatedSlider = ({ topRatedMovies }) => {
  const ref = useRef(null);
  const [clickCounter, setClickCounter] = useState(1);
  const navigate = useNavigate();

  //handle scroll click
  const handleClick = (number) => {
    const totalPages = topRatedMovies.length;

    if (clickCounter + number < 1) {
      return;
    }

    const newIndex = clickCounter + number;
    if (newIndex > totalPages) {
      setClickCounter(1);
      resetScroll();
      return;
    } else {
      setClickCounter(newIndex);
    }
    scrollRightHandler(number * 250);
  };

  //scroll manually
  const scrollRightHandler = (scrollOffset) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
    }
  };
  const resetScroll = () => {
    ref.current.scrollLeft = 0;
  };
  //auto scroll for top rated movies
  useEffect(() => {
    const interval = setInterval(() => {
      handleClick(1);
    }, 8000);
    return () => clearInterval(interval);
  }, [clickCounter, topRatedMovies]);
  console.log(topRatedMovies);
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
                      src={"http://localhost:5000" + movie.images.banner}
                      className="slider-movie-image"
                    />
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
