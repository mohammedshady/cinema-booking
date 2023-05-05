import { useParams, Link } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";

// components
import Navbar from "../Navbar";
import "./MovieDetails.css";
import Date from "../util/Date";
import Loader from "../util/Loader";
import ArrayString from "../util/ArrayString";

import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

const initialState = {
  loading: true,
  error: "",
  movie: {},
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_SUCCESS":
      return { loading: false, error: "", movie: payload };
    case "FETCH_ERROR":
      return { ...state, error: payload };
    default:
      return state;
  }
};

const MovieDetails = () => {
  const { id } = useParams();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { loading, error, movie } = state;

  const {
    _id,
    title,
    images,
    description,
    trailer_link,
    release_date,
    language,
    duration,
    genre,
    actors,
    status,
  } = movie;

  useEffect(() => {
    axios
      .get(`/api/movies/${id}`)
      .then((res) => {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.movie });
        //add related movies fetch
      })
      .catch((error) =>
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" })
      );
  }, []);

  if (error) return <Loader msg="error" />;
  else if (loading) return <Loader msg="loading" />;

  const TABLE_FIELDS = [
    {
      key: "Title",
      value: title,
    },
    {
      key: "Release Date",
      value: <Date date={release_date} />,
    },
    {
      key: "Language",
      value: <ArrayString arr={language} />,
    },
    {
      key: "Duration",
      value: `${parseInt(duration / 60)}h, ${parseInt(duration % 60)}m`,
    },
    {
      key: "Genres",
      value: <ArrayString arr={genre} />,
    },
    {
      key: "Cast",
      value: <ArrayString arr={actors} />,
    },
  ];
  return (
    <>
      <Navbar />
      <div className="movie-details-container">
        <div className="movie-details-inner-container">
          <div className="movie-img-text first-section">
            <div className="movie-details-img">
              <img src={movie.images.poster} alt="movie-image" />
            </div>
            <div className="movie-details-text ">
              <div className="movie-desc-title">{movie.title}</div>
              <div className="movie-desc-desc">{movie.description}</div>
              <div className="movie-data">
                <div className="movie-rating">
                  <span>{}</span>
                </div>
                <div className="movie-duration">
                  <span>{duration}</span>
                </div>
                <div className="movie-genre">
                  {genre.map((item) => {
                    return <span className="movie-genre-item">{item}</span>;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="movie-options-container second-section">
            <div className="movie-controls">
              <button className="movie-details-first-btn">Watch Trailer</button>
              {status === "released" ? (
                <Link to={`/shows/${_id}`} className="movie-details-sec-btn">
                  Book Now !
                </Link>
              ) : (
                <div className="movie-details-sec-btn">UnReleased</div>
              )}
            </div>
            <div className="movie-cast-details">
              {actors.map((actor) => (
                <div className="movie-cast-details-item" key={actor}>
                  <div className="cast-img"></div>
                  <div className="cast-name">{actor}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="third-section">
            <div className="movie-cards-header">More of This..</div>
            <div className="movie-cards">
              {[1, 2, 3, 4, 5, 6].map((x) => (
                <div className="movie-card-container" key={x}>
                  <div className="movie-card-img"></div>
                  <div className="movie-title">{x}</div>
                </div>
              ))}
              <button className="see-more-button">
                <ArrowForwardIosOutlinedIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Trailer
              
            </div>
            <div className={styles.table_container}>
              <table>
                <tbody>
                  {TABLE_FIELDS.map(({ key, value }, index) => (
                    <tr className={styles.tr} key={index}>
                      <td className={styles.table_fields}>{key}</td>
                      <td className={styles.table_td}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default MovieDetails;
