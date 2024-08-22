import Date from "../util/Date";
import Time from "../util/Time";
import ArrayString from "../util/ArrayString";
import QRCode from "react-qr-code";

import "./Ticket.css";

const Ticket = ({ booking, handleDelete }) => {
  const LIST_ITEMS = [
    {
      name: "Screen : ",
      value: booking.show.screenName,
    },
    {
      name: "",
      value: (
        <div>
          <Date date={booking.show.date} /> | <Time time={booking.show.date} />
        </div>
      ),
    },
    {
      name: "Seats : ",
      value: <ArrayString arr={booking.seats} />,
    },
    {
      name: "Amount : ",
      value: `${booking.totalAmount} EGP`,
    },
  ];
  return (
    <div className="ticket-item">
      <span className="delete-booking-icon">
        <button
          className="delete-booking-btn"
          onClick={() => {
            handleDelete(booking._id);
          }}
        >
          cancel
        </button>
      </span>
      <div className="ticket-cosm right"></div>
      <div className="ticket-cosm left"></div>
      {/* {booking.isExpired ? (
      ) : null} */}
      <div className="ticket-movie-img-container">
        <img
          className="ticket-movie-img"
          src={"http://localhost:5000" + booking.movie.images.poster}
          alt={booking.movie.title}
        />
      </div>
      <div className="ticket-item-details">
        <h1 className="ticket-item-header">
          {booking.movie.title.length > 15
            ? `${booking.title?.substr(0, 15)} . . .`
            : booking.movie.title}
        </h1>
        <ul>
          {LIST_ITEMS.map((item, index) => (
            <li key={index} className="ticket-details-list">
              <p className="ticket-details-list-item">
                <span className="ticket-details-list-item-p">{item.name}</span>
                <span className="ticket-details-list-item-text">
                  {item.value}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="ticket-movie-qr-code">
        <QRCode value={booking.bookingId} style={{ width: 120, height: 120 }} />
        <p className="ticket-movie-qr-code-details">
          <span className="ticket-movie-qr-code-details-p">Booking ID</span>
          <span className="ticket-movie-qr-code-details-text">
            {booking.bookingId}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Ticket;
