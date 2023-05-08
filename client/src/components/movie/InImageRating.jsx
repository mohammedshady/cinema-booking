import React, { useState } from "react";
import { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import ProgressProvider from "../util/ProgressProvider";
import "react-circular-progressbar/dist/styles.css";

const InImageRating = ({ rating }) => {
  const goodRating = "#42f572";
  const mehRating = "#ebf25c";
  const badRating = "#f25e5c";

  const [ratingColor, setRatingColor] = useState("");

  useEffect(() => {
    let color = "";
    if (rating >= 3) {
      color = goodRating;
    } else if (rating > 1 && rating < 3) {
      color = mehRating;
    } else {
      color = badRating;
    }
    setRatingColor(color);
  }, []);
  return (
    <>
      <div
        style={{
          width: 50,
          height: 50,
          margin: 10,
        }}
        className="in-image-rating"
      >
        <ProgressProvider
          valueStart={0}
          valueEnd={parseInt(rating)}
          maxValue={5}
        >
          {(value) => (
            <CircularProgressbar
              strokeWidth={11}
              value={value}
              maxValue={5}
              text={rating}
              styles={buildStyles({
                pathTransitionDuration: 1,
                textSize: "28px",

                pathColor: `${ratingColor}`,
                textColor: `${ratingColor}`,
              })}
            />
          )}
        </ProgressProvider>
      </div>
    </>
  );
};
export default InImageRating;
