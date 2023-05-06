import { useState, useEffect } from "react";
import Loader from "./Loader";
import "./SeatMap.css";

const seatSet = new Set();

const SeatMap = (props) => {
  const { availableSeats, bookedSeats, rows, cols, handleSelectedSeats } =
    props;

  const myRows = [];
  const myCols = [];

  const available = availableSeats?.map((seat) => ({
    ...seat,
    isBooked: false,
  }));
  const booked = bookedSeats?.map((seat) => ({ ...seat, isBooked: true }));

  const seats = [...available, ...booked];

  useEffect(() => {
    seatSet.clear();
  }, []);

  /**
   * creating state variable for managing selected & not selected seats
   */
  const defaultCheckedSeats = new Array(seats.length).fill(false);
  seats.forEach((seat) => {
    const myIndex = cols * (seat.row - 1) + (seat.col - 1);
    defaultCheckedSeats[myIndex] = seat.isBooked;
  });

  const [checkedSeats, setCheckedSeats] = useState(defaultCheckedSeats);

  const handleSeatChange = (myIndex, e) => {
    /**
     * if defaultChecked is false =>
     * 		user want to select that seat =>
     * 			change defaultChecked option & add to set
     *
     * else =>
     * 		user want to disselect seat =>
     * 			change defaultChecked option & remove from set
     * */
    // if (checkedSeats[myIndex] == (false || undefined)) {
    //   seatSet.add(e.target.value);
    //   const newArr = checkedSeats;
    //   newArr[myIndex] = true;
    //   setCheckedSeats([...newArr]);
    // } else {
    //   seatSet.delete(e.target.value);
    //   const newArr = checkedSeats;
    //   newArr[myIndex] = false;
    //   setCheckedSeats([...newArr]);
    // }
    console.log(checkedSeats[myIndex]);

    if (checkedSeats[myIndex] == false || checkedSeats[myIndex] == undefined) {
      seatSet.add(e.target.dataset.value);
      const newArr = checkedSeats;
      newArr[myIndex] = true;
      setCheckedSeats([...newArr]);
    } else {
      seatSet.delete(e.target.dataset.value);
      const newArr = checkedSeats;
      newArr[myIndex] = false;
      setCheckedSeats([...newArr]);
    }
    handleSelectedSeats(seatSet);
  };

  const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  myCols.push("");

  let leftRightCols = 4;
  let middleCols = cols - leftRightCols * 2;

  while (leftRightCols * 2 > middleCols) {
    leftRightCols--;
    middleCols = cols - leftRightCols * 2;
  }

  for (let col = 1; col <= cols; col++) {
    myCols.push(col);

    if (col === leftRightCols || col === leftRightCols + middleCols) {
      myCols.push(<div className="input-seat transparent" />);
    }
  }

  for (let row = 1; row <= rows; row++) {
    let tr = [];
    tr.push(str[row - 1]);
    for (let col = 1; col <= cols; col++) {
      const seat = seats.find((seat) => seat.row === row && seat.col === col);
      const myIndex = cols * (seat.row - 1) + (seat.col - 1);
      tr.push(
        // <input
        //   className="input-seat"
        //   type="checkbox"
        //   checked={checkedSeats[myIndex]}
        //   disabled={seat?.isBooked}
        //   value={seat?._id}
        //   name={seat?.name}
        //   onChange={(e) => handleSeatChange(myIndex, e)}
        // />
        <div
          className={`input-seat ${
            checkedSeats[myIndex]
              ? "checked"
              : `${seat?.isBooked ? "disabled" : ""}`
          }`}
          data-value={seat?._id}
          id={seat?.name}
          onClick={(e) => handleSeatChange(myIndex, e)}
        ></div>
      );

      if (col === leftRightCols || col === leftRightCols + middleCols) {
        tr.push(<div className="input-seat transparent" />);
      }
    }

    myRows.push(tr);
  }

  if (props.loading) return <Loader msg="loading" />;

  return (
    <div className="seat-map-container">
      <table>
        <thead>
          {myRows.map((row, index) => (
            <tr key={index} className={`${index}`}>
              {row.map((element, index) => (
                <td className={`seat-map-row-item ${index}`} key={index}>
                  {element}
                </td>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr>
            {myCols.map((col, index) => (
              <th key={index} className="seat-map-col-item">
                {col}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SeatMap;
