import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./form.css";
// components
import BackButton from "../util/BackButton";
import Loader from "../util/Loader";

// toast
import { toast } from "react-toastify";

import { signupUser, useAuthDispatch, useAuthState } from "../../context";

const defaultFormData = {
  fname: "",
  lname: "",
  email: "",
  mobile_no: "",
  gender: "",
  password: "",
};

const Signup = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const dispatch = useAuthDispatch();
  const { loading } = useAuthState();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  const validateInput = (values) => {
    const { email, password } = values;
    const errors = {};
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email))
      errors.email = "Please enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 6)
      errors.password = "Password must be 6 characters long";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return true;
    return false;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInput(formData)) return;

    const res = await signupUser(dispatch, formData);
    if (res) navigate("/movies");
  };

  if (loading) return <Loader msg="loading" />;

  return (
    <div className="form-signup-block">
      <div className="form-container">
        <h1>SignUp</h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-inputs-container">
            <div className="form-container-group">
              <div>
                <label htmlFor="">fname</label>
                <input
                  className="input-group"
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="">lname</label>
                <input
                  className="input-group"
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                />
              </div>
              {/* <div className={`form-container-p`}>{formErrors.name}</div> */}
            </div>
            <div>
              <label htmlFor="">email</label>
              <input
                className="form-container-input"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <p className={`form-container-p`}>{formErrors.email}</p>
            </div>
            <div>
              <label htmlFor="">password</label>
              <input
                className="form-container-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <p className={`form-container-p`}>{formErrors.password}</p>
            </div>
            <div>
              <label htmlFor="">phone</label>
              <input
                className="form-container-input"
                type="text"
                name="mobile_no"
                value={formData.mobile_no}
                onChange={handleChange}
              />
              <p className={`form-container-p`}>{formErrors.mobile_no}</p>
            </div>
            <div>
              <label htmlFor="">birth date</label>
              <input
                className="form-container-input"
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
              />
              <p className={`form-container-p`}>{formErrors.birth_date}</p>
            </div>
            <div className="form-container-group">
              <div className="form-container-input">
                <label>Male</label>
                <input
                  type="checkbox"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
              </div>
              <div className="form-container-input">
                <label>Female</label>
                <input
                  type="checkbox"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="form-container-btn">
              SignUp
            </button>
            <p className="form-container-links">
              Already have account ?{" "}
              <Link to="../login" replace={true} className="text-blue-400">
                Login
              </Link>
            </p>
          </div>
          <BackButton />
        </form>
      </div>
    </div>
  );
};

export default Signup;
