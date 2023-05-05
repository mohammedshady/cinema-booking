import { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import "./UserProfileButton.css";
import { logout, useAuthDispatch } from "../context";

let useClickOutside = (handler) => {
  let domNode = useRef();

  useEffect(() => {
    let menuCloseHandler = (e) => {
      if (!domNode.current.contains(e.target)) handler();
    };

    document.addEventListener("mousedown", menuCloseHandler);

    return () => {
      document.removeEventListener("mousedown", menuCloseHandler);
    };
  });

  return domNode;
};

const User = ({ icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  let menuRef = useClickOutside(() => setIsOpen(false));

  return (
    <>
      <div ref={menuRef} className="user-profile-container">
        <div onClick={() => setIsOpen(!isOpen)} className="user-profile-btn">
          <div className="user-avatar">
            <p className="user-avatar-text">{icon}</p>
          </div>
        </div>
        {isOpen ? (
          <div className="user-nav-menu">
            <ArrowDropUpIcon className="user-nav-menu-drop-icon" />
            <div className="user-nav-menu-list">
              <Link to={"/bookings"} className="user-nav-menu-item-container">
                <span className="user-nav-menu-item">
                  <span>
                    <StyleOutlinedIcon />
                    My Bookings
                  </span>
                </span>
              </Link>
              <Link to={"/feedback"} className="user-nav-menu-item-container">
                <span className="user-nav-menu-item">
                  <span>
                    <TextsmsOutlinedIcon />
                    Give Feedback
                  </span>
                </span>
              </Link>
              <div
                onClick={() => {
                  logout(dispatch);
                  navigate("/");
                }}
                className="user-nav-menu-item-container"
              >
                <span className="user-nav-menu-item">
                  <span>
                    <LogoutRoundedIcon />
                    Logout{" "}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default User;
