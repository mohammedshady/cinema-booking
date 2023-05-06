import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";
import "./form.css";

import { loginUser, useAuthDispatch, useAuthState } from "../../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useAuthDispatch();
  const { loading } = useAuthState();

  const navigate = useNavigate();

  const validateInput = (values) => {
    const { email, password } = values;
    const errors = {};
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email))
      errors.email = "Please enter a valid email";
    if (!password) errors.password = "Password is required";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return true;
    return false;
  };

  // login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    let data = { email, password };

    if (validateInput({ email, password })) return;

    let user = await loginUser(dispatch, data);
    if (!user) return;
    user?.role == 1 ? navigate("/admin") : navigate("/");
  };

  if (loading) return <Loader msg="loading" />;

  return (
    <div className="form-login-block">
      <div className="form-container">
        <h1>LogIn</h1>
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-inputs-container">
            <div>
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
            <div>
              <label htmlFor="">password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-container-input"
              />
              <p className="form-container-p">{formErrors.password}</p>
            </div>

            <button type="submit" className="form-container-btn">
              Login
            </button>

            <div>
              <p className="form-container-links">
                New user ?{" "}
                <Link to="../signup" replace={true} className="text-blue-400">
                  SignUp
                </Link>
              </p>
              <div>
                <Link to="/user/resetPassword" className="text-blue-400">
                  Forgot password ?
                </Link>
              </div>
            </div>
          </div>
          <BackButton />
        </form>
      </div>
    </div>
  );
};

export default Login;
