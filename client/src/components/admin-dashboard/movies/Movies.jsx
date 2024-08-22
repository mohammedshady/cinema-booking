import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Loader from "../../util/Loader";
import Table from "../common/Table";

const tableHeaderCells = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "duration",
    label: "Duration",
  },
  {
    id: "shows",
    label: "Shows",
  },
  {
    id: "date",
    label: "Release Date",
  },
  {
    id: "status",
    label: "Status",
  },
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = () => {
    axios
      .get(`/api/admin/movies`)
      .then((res) => {
        setMovies(res.data.data.movies);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.response?.status == 403) navigate("/login");
        else notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const deleteMovies = (ids) => {
    setLoading(true);
    axios
      .delete(`/api/admin/movies/?ids=${ids.join(",")}`)
      .then(() => {
        fetchMovies();
        setLoading(false);
      })
      .catch((err) => {
        if (err?.response?.status == 403) navigate("/login");
        else notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });
  };

  if (loading) return <Loader msg="loading" />;

  return (
    <Table
      data={movies}
      tableTitle="Movies"
      altTableTitle="Deleted Movies"
      headCells={tableHeaderCells}
      searchBy="title"
      addLink="/admin/movies/add"
      historyStatus="deleted"
      navigate={navigate}
      showHeader
      showSort
      showCheckBox
      showEdit
      onDelete={deleteMovies}
    />
  );
};

export default Movies;
