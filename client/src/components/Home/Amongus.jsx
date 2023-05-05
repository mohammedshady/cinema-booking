import React from "react";
import { useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import ProgressProvider from "./ProgressProvider";
import "react-circular-progressbar/dist/styles.css";

const Amongus = () => {
  return (
    <>
      <div
        style={{
          width: 50,
          height: 50,
          margin: 10,
          color: "red",
        }}
        className="in-image-rating"
      >
        <ProgressProvider valueStart={0} valueEnd={4} maxValue={5}>
          {(value) => (
            <CircularProgressbar
              strokeWidth={11}
              value={value}
              maxValue={5}
              text={value}
              styles={buildStyles({
                pathTransitionDuration: 1,
                textSize: "28px",
              })}
            />
          )}
        </ProgressProvider>
      </div>
    </>
  );
};
export default Amongus;
