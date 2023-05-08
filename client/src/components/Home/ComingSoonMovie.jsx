import DateComponent from "../util/Date";
import StarIcon from "@mui/icons-material/Star";
import ArrayString from "../util/ArrayString";

const ComingSoonMovie = ({
  recentComingSoonMovie,
  moviesRef,
  ratedMoviesRef,
}) => {
  return (
    <div className="exclusive-coming-soon-movie">
      <div className="coming-soon-movie-container">
        <img
          src={recentComingSoonMovie?.images.banner}
          alt="Coming-Soon-Movie"
        />
        <div className="coming-soon-movie-details-container">
          <div className="coming-soon-movie-details-date">
            <DateComponent date={recentComingSoonMovie?.release_date} noyear />
          </div>
          <div className="coming-soon-movie-details">
            <div className="coming-soon-movie-details-text">
              <div className="coming-soon-movie-details-text-title">
                {recentComingSoonMovie?.title}
                <div className="coming-soon-movie-details-text-title-controls">
                  <span>
                    {recentComingSoonMovie.rating}
                    <span>
                      <StarIcon color={"warning"} fontSize={"0.8rem"} />
                      {"  ●  "}
                    </span>
                  </span>
                  <span>{recentComingSoonMovie.duration + " min  ●  "}</span>
                  <span>
                    <ArrayString arr={recentComingSoonMovie.genre} />;
                  </span>
                </div>
              </div>
              <div className="coming-soon-movie-details-text-desc">
                {recentComingSoonMovie.description}
              </div>
              <div className="coming-soon-movie-details-controls">
                <button
                  className="coming-soon-movie-controls-btn1"
                  onClick={() =>
                    moviesRef.current.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Browse Movies
                </button>
                <button
                  className="coming-soon-movie-controls-btn2"
                  onClick={() =>
                    ratedMoviesRef.current.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                >
                  Top Rated
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ComingSoonMovie;
