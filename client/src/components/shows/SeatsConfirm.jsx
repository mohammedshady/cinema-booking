import React from "react";
import { useState } from "react";
import "./seatsConfirm.css";

const SeatsConfirm = ({ msg, handleSubmit, setState }) => {
  return (
    <div className="seats-confirm-container">
      <div className="seats-confirm-header">{msg.header}</div>
      <div className="seats-confirm-text">{msg.msg}</div>
      <div className="seats-confirm-controls">
        {msg.status === "success" ? (
          <button className="seats-confirm-btn" onClick={handleSubmit}>
            Confirm
          </button>
        ) : null}

        <button className="seats-confirm-btn" onClick={(e) => setState(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};
export default SeatsConfirm;
