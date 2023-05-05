import Date from "../util/Date";
import Time from "../util/Time";
import ArrayString from "../util/ArrayString";

import QRCode from "react-qr-code";

import "./Ticket.css";

const Ticket = ({ booking }) => {
  const {
    show: { screenName, date, startTime },
    totalAmount,
    bookingId,
    seats,
    movie: {
      images: { poster },
      title,
    },
    isExpired,
  } = booking;

  const LIST_ITEMS = [
    {
      name: "Screen : ",
      value: screenName,
    },
    {
      name: "",
      value: (
        <div>
          <Date date={date} /> | <Time date={date} />
        </div>
      ),
    },
    {
      name: "Seats : ",
      value: <ArrayString arr={seats} />,
    },
    {
      name: "Amount : ",
      value: `${totalAmount} INR`,
    },
  ];

  return (
    <div className="ticket-item">
      <div className="ticket-cosm right"></div>
      <div className="ticket-cosm left"></div>
      {isExpired ? (
        <div className="absolute top-5 right-[-30px] bg-red-500 px-8 rotate-[45deg]">
          <p className="text-white font-semibold">Expired</p>
        </div>
      ) : null}
      <div className="ticket-movie-img-container">
        <img className="ticket-movie-img" src={poster} alt={title} />
      </div>
      <div className="ticket-item-details">
        <h1 className="ticket-item-header">
          {title.length > 15 ? `${title?.substr(0, 15)} . . .` : title}
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
        <QRCode value={bookingId} style={{ width: 120, height: 120 }} />
        <p className="ticket-movie-qr-code-details">
          <span className="ticket-movie-qr-code-details-p">Booking ID</span>
          <span className="ticket-movie-qr-code-details-text">{bookingId}</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container:
    "flex max-w-sm mx-2 my-2 bg-white rounded overflow-hidden relative",
  image_container: "w-1/3",
  details_container: "w-2/3 p-1 md:p-2",
  h1: "text-gray-900 font-bold text-xl md:text-2xl",
  btn_container: "flex item-center justify-start",
  btn: "px-3 py-2 w-full mr-3 bg-blue-600 text-white text-xs rounded",
};

export default Ticket;
