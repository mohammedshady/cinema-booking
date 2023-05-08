import React from "react";
import "./NoItem.css";

const NoItem = ({ item }) => {
  return (
    <div className="no-item-container">
      <p className="no-item-text">{item}</p>
    </div>
  );
};

export default NoItem;
