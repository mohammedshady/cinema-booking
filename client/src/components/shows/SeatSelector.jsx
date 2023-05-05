import { useEffect, useReducer, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import SeatMap from "../util/SeatMap";
import Loader from "../util/Loader";

import axios from "axios";

// toast
import "./SeatSelector.css";
import Navbar from "../Navbar";

import screenLogo from "./../../assets/images/screen.png";
import SeatsConfirm from "./seatsConfirm";

const initialState = {
  loading: true,
  error: "",
  availableSeats: [],
  bookedSeats: [],
  screen: {},
  price: 0,
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "FETCH_SUCCESS":
      const { screen, price } = payload.show;
      let availableSeats = [];
      let bookedSeats = [];
      let availableIndex = 0;
      let bookedIndex = 0;
      for (let i = 0; i < payload.show.seats.length; i++) {
        if (payload.show.seats[i].available === true) {
          availableSeats[availableIndex] = payload.show.seats[i];
          availableIndex++;
        } else {
          bookedSeats[bookedIndex] = payload.show.seats[i];
          bookedIndex++;
        }
      }
      return {
        ...state,
        loading: false,
        availableSeats,
        bookedSeats,
        screen,
        price,
      };

    case "FETCH_ERROR":
      return { ...state, error: payload };

    default:
      return state;
  }
};

const SeatSelector = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [msg, setMsg] = useState({});
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [multipleSeatConflict, setMultipleSeatConflict] = useState(false);

  const { loading, error, availableSeats, bookedSeats, screen, price } = state;

  const fetchSeats = () => {
    axios
      .get(`/api/shows/seats/${id}`)
      .then((res) => {
        dispatch({ type: "FETCH_SUCCESS", payload: res.data.data });
        console.log(res.data.data);
      })
      .catch((err) => {
        if (err.response.status == 403)
          navigate("/login", { state: { from: location } });
        dispatch({ type: "FETCH_ERROR", payload: "Something went wrong" });
      });
  };

  useEffect(() => {
    fetchSeats();
  }, [multipleSeatConflict]);

  const [seats, setSeats] = useState([]);

  const handleSelectedSeats = (seatSet) => {
    setSeats([...seatSet]);
  };
  const handleModal = () => {
    if (seats.length == 0) {
      setMsg({
        status: "error",
        header: "no seats selected",
        msg: "there wasnt any selected seats please try again",
      });
    } else {
      setMsg({
        status: "success",
        header: "Your Seats Were Selected",
        msg: "Are you sure you want to book them",
      });
    }
    setShow(true);
  };
  const handleSubmit = async (e) => {
    setShow(false);
    e.preventDefault();
    const formData = {
      show: id,
      seats,
    };
    axios
      .post(`/api/user/bookShow`, formData)
      .then((response) => {
        console.log("booked the " + response);
        navigate("/bookings");
      })
      .catch((error) => {
        if (error.response.status == 403)
          navigate("/login", { state: { from: location } });
        else {
          setMultipleSeatConflict(true);
        }
      });
  };

  // if (error) return <Loader msg="error" />;
  // else if (loading) return <Loader msg="loading" />;

  return (
    <>
      {show ? (
        <SeatsConfirm
          msg={msg}
          handleSubmit={handleSubmit}
          setState={setShow}
        />
      ) : null}
      <div
        className={`seat-selector-page  ${show ? "modal-background" : null}`}
      >
        <Navbar />
        <div className="seat-selector-container">
          <div className="seat-selector-inner-container ">
            <div className="seat-selector-header">
              <div className="seat-selector-header-text">
                Select Your Seats Below
              </div>
              <div className="seat-selector-header-price"></div>
            </div>
            <div className="seat-selector-screen">
              <img src={screenLogo} alt="screen" />
            </div>
            <div className="seat-selector-seat-map">
              <SeatMap
                availableSeats={availableSeats}
                bookedSeats={bookedSeats}
                rows={screen?.totalRows}
                cols={screen?.totalColumns}
                handleSelectedSeats={handleSelectedSeats}
              />
            </div>
            <div className="seat-selector-controls">
              <button
                onClick={handleModal}
                type="button"
                className="seat-selector-pay-btn"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatSelector;
