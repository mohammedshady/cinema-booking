import React, { useState } from "react";
import { Link } from "react-router-dom";
import User from "./UserProfileButton";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

import { useAuthState } from "../context";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuthState();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header>
      <h1>LOGO</h1>

      <nav>
        <ul>
          <li
            className="nav-list-item"
            style={
              location.pathname === "/"
                ? { borderBottom: "2px solid #3b82f6" }
                : null
            }
            onClick={() => navigate("/")}
          >
            Home
          </li>
          <li
            className="nav-list-item"
            style={
              location.pathname === "/movies"
                ? { borderBottom: "2px solid  #3b82f6" }
                : null
            }
            onClick={() => navigate("/movies")}
          >
            Movies
          </li>
          <li
            className="nav-list-item"
            style={
              location.pathname === "/movies"
                ? { borderBottom: "2px solid  #3b82f6" }
                : null
            }
          >
            Search
          </li>
        </ul>
      </nav>
      <div className="user-controls">
        {user != null ? (
          <User icon={user.email[0].toUpperCase()} />
        ) : (
          <button
            type="button"
            className="nav-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
