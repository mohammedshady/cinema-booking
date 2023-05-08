import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

// components
import Navbar from "../navBar/Navbar";
import Ticket from "./Ticket";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";

import "./Booking.css";
import notify from "../admin-dashboard/common/notify";

const initialState = {
  loading: true,
  error: null,
  bookings: [],
};
//removereducer 1
const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_SUCCESS":
      return { loading: false, error: "", bookings: payload };
    case "FETCH_ERROR":
      return { ...state, error: payload };
    default:
      return state;
  }
};

const Booking = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [deleted, setDeleted] = useState(false); //to refresh fetching data from the ticket component
  const navigate = useNavigate();

  const { loading, bookings } = state;

  //delete a booking handler
  const deleteHandler = async (id) => {
    axios
      .delete(`/api/user/bookings/${id}`)
      .then((res) => {
        setDeleted(true); //for deletion refresh
      })
      .catch((err) => {
        if (err.response.status == 403) navigate("/login");
        notify(err?.response?.data?.message || err.toString());
      });
  };
  //fetch user Bookings
  const fetchBookings = async () => {
    axios
      .get(`/api/user/bookings`)
      .then((res) => {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.bookings });
        setDeleted(false); //for deletion refresh
      })
      .catch((error) => {
        if (error.response.status == 403) navigate("/login");
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
      });
  };

  //refresh user bookings upon deletion
  useEffect(() => {
    fetchBookings();
  }, [deleted]);

  if (loading) return <Loader msg="loading" />;

  return (
    <>
      <Navbar />
      <div className="my-bookings-container">
        <div className="my-bookings-header">My Bookings</div>
        <div className="my-booking-tickets">
          {bookings?.length > 0 ? (
            bookings?.map((booking) => (
              <Ticket
                booking={booking}
                key={booking._id}
                handleDelete={deleteHandler}
              />
            ))
          ) : (
            <div>
              <NoItem item={"You don't have any bookings yet!"} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Booking;
