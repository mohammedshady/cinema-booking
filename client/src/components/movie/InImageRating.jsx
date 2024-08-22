import React, { useState } from "react";
import { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import ProgressProvider from "../util/ProgressProvider";
import "react-circular-progressbar/dist/styles.css";

const InImageRating = ({ rating }) => {
  const goodRating = "#67b57c";
  const mehRating = "#d3db7d";
  const mehRating2 = "#dbb57d";
  const badRating = "#de6657";

  const [ratingColor, setRatingColor] = useState("");

  useEffect(() => {
    let color = "";
    if (rating >= 4) {
      color = goodRating;
    } else if (rating >= 3 && rating < 4) {
      color = mehRating;
    } else if (rating >= 2 && rating < 3) {
      color = mehRating2;
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
              strokeWidth={10}
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
