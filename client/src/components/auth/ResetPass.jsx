import React, { useState } from "react";
import axios from "axios";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import { toast } from "react-toastify";
import "./form.css";
import { useNavigate } from "react-router-dom";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [birth_date, setBirth_date] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const validateInput = () => {
    const errors = {};
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email))
      errors.email = "Please enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be 6 characters long";
    if (!password) errors.password = "Password is required";

    if (!birth_date) {
      errors.birth_date = "birthdate is required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return true;
    return false;
  };
  // login handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      try {
        setLoading(true);
        const res = await axios.post("api/user/resetPassword", {
          email,
          date_of_birth: birth_date,
          newPassword: password,
        });
        toast.success(res.data.message);
        navigate("/");
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };

  if (loading) return <Loader msg="loading" />;

  return (
    <div>
      <div className="form-container">
        <h1>ForgotPass</h1>
        <form
          action="submit"
          className="form-actual-container reset-container"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <div className="form-inputs-container">
            <div className="full-width">
              <p className="form-container-msg">
                Enter your Email so we can reset Your Password
              </p>
              <label htmlFor="">email</label>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-container-input"
              />
              <p className={`form-container-p`}>{formErrors.email}</p>
            </div>

            <div className="full-width">
              <label htmlFor="">birth Date</label>
              <input
                type="date"
                name="date"
                value={birth_date}
                onChange={(e) => setBirth_date(e.target.value)}
                className="form-container-input"
              />
              <p className={`form-container-p`}>{formErrors.birth_date}</p>
            </div>
            <div className="full-width">
              <label htmlFor="">new Password</label>
              <input
                type="password"
                name="password"
                value={password}
                autocomplete="on"
                onChange={(e) => setPassword(e.target.value)}
                className="form-container-input"
              />
              <p className={`form-container-p`}>{formErrors.password}</p>
            </div>
            <button type="submit" className="form-container-btn">
              Submit
            </button>
          </div>
          <BackButton />
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
