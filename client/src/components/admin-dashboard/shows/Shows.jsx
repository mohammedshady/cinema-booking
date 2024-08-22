import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../common/notify";
import Loader from "../../util/Loader";
import Table from "../common/Table";

const tableHeaderCells = [
  {
    id: "movie",
    label: "Movie",
  },
  {
    id: "dateTime",
    label: "Date & Time",
  },
  {
    id: "totalBookings",
    label: "Total Bookings",
  },
  {
    id: "screen",
    label: "Screen Name",
  },
  {
    id: "price",
    label: "Ticket Price",
  },
];

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchShows = () => {
    axios
      .get(`/api/admin/shows`)
      .then((res) => {
        setShows(res.data.data.shows);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.response?.status == 403) navigate("/login");
        else notify(err?.response?.data?.message || err.toString());
        !err.toString().includes("Network Error") && setLoading(false);
      });
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const deleteShows = (ids) => {
    setLoading(true);
    axios
      .delete(`/api/admin/show/?ids=${ids.join(",")}`)
      .then(() => {
        fetchShows();
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
      data={shows}
      tableTitle="Shows"
      altTableTitle="Ended Shows"
      headCells={tableHeaderCells}
      searchBy="movie"
      addLink="/admin/shows/add"
      historyStatus="ended"
      navigate={navigate}
      showHeader
      showSort
      showCheckBox
      showEdit
      onDelete={deleteShows}
    />
  );
};

export default Shows;
