import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";
import "../auth/form.css";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate("/");
      }}
      className="nav-movies-btn"
    >
      Browse Movies
    </button>
  );
};

export default BackButton;
