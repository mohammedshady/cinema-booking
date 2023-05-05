import React, { useState } from "react";
import axios from "axios";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import { toast } from "react-toastify";
import "./form.css";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // login handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) {
      setFormErrors({ email: "Email is required" });
      return;
    } else if (!emailRegex.test(email)) {
      setFormErrors({ email: "Please enter valid email" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("api/user/forgotPassword", { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader msg="loading" />;

  return (
    <div>
      <div className="form-container">
        <h1>ForgotPass</h1>
        <form action="submit" className="form-actual-container">
          <div>
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
          <button type="submit" className="form-container-btn">
            Submit
          </button>
        </form>
        {/* <BackButton /> */}
      </div>
    </div>
  );
};

export default ForgotPass;
