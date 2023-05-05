import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// components
import Navbar from "../Navbar";
import Ticket from "./Ticket";
import Loader from "../util/Loader";
import NoItem from "../util/NoItem";

import "./Booking.css";

const initialState = {
  loading: true,
  error: null,
  bookings: [],
};

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
  const location = useLocation();
  const navigate = useNavigate();

  const { loading, error, bookings } = state;

  const fetchBookings = async () => {
    axios
      .get(`/api/user/bookings`)
      .then((res) => {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data.bookings });
      })
      .catch((error) => {
        if (error.response.status == 403)
          navigate("/login", { state: { from: location } });
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (error) return <Loader msg="error" />;
  else if (loading) return <Loader msg="loading" />;

  return (
    <>
      <Navbar />
      <div className="my-bookings-container">
        <div className="my-bookings-header">My Bookings</div>
        <div className="my-booking-tickets">
          {bookings?.length > 0 ? (
            bookings?.map((booking, index) => (
              <Ticket booking={booking} key={booking._id} />
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

const styles = {
  nobooking:
    "max-w-[1296px] w-[100vw] relative flex justify-center items-center m-auto",
  nobookings_p: "text-center font-extrabold text-gray-400 mt-48",
};

export default Booking;
