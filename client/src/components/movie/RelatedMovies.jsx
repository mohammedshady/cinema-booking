import { useState } from "react";
import { useEffect } from "react";
import NoItem from "../util/NoItem";
import Loader from "../util/Loader";
import axios from "axios";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useNavigate } from "react-router-dom";

const RelatedMovies = ({ genres, _id }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/user/movies")
      .then((res) => {
        setRelatedMovies((prev) => [...prev, ...res.data.data.movies]);
        setLoading(false);
        const filterdRelatedMovies = res.data.data.movies.filter((movie) => {
          for (let i = 0; i < movie.genre.length; i++) {
            if (genres.includes(movie.genre[i]) && movie._id !== _id) {
              return true;
            }
          }
          return false;
        });
        setRelatedMovies(filterdRelatedMovies.slice(0, 5));
      })
      .catch((err) => {
        if (err?.response?.status == 403) navigate("/login");
        else notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });
  }, []);

  if (loading) return <Loader msg="loading" />;
  return (
    <>
      {relatedMovies.length > 0 ? (
        <div>
          <div className="movie-cards-header">More of This..</div>
          <div className="movie-cards">
            {relatedMovies.map((movie) => (
              <div className="movie-card-container" key={movie.title}>
                <img
                  src={"http://localhost:5000" + movie.images.poster}
                  className="movie-card-img"
                ></img>
                <div className="movie-title">{movie.title}</div>
              </div>
            ))}
            <button
              className="see-more-button"
              onClick={() => {
                navigate("/movies");
              }}
            >
              <ArrowForwardIosOutlinedIcon />
            </button>
          </div>
        </div>
      ) : (
        relatedMovies.length === 0 && (
          <NoItem item={"found no related Movies"} />
        )
      )}
    </>
  );
};

export default RelatedMovies;
