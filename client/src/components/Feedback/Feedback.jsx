import Navbar from "../Navbar";
import BackButton from "../util/BackButton";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Feedback.css";

// toast
import { toast } from "react-toastify";
import axios from "axios";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const validateInput = (message) => {
    const errors = {};

    if (!message) errors.message = "Please write your message";

    setFormError(errors);

    if (Object.keys(errors).length > 0) return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInput(message)) return;

    try {
      const res = await axios.post(`/api/user/feedback`, { message });
      if (res) {
        toast.success("Thanks for your valuable feedback");
        navigate(-1);
      }
    } catch (error) {
      if (error.response.status == 403)
        navigate("/login", { state: { from: location } });
    }
  };

  return (
    <>
      <Navbar />
      <div className="feedback-page">
        <form className="feedback-container" onSubmit={handleSubmit}>
          <h1>Your Feedback is important to us</h1>
          <textarea
            onChange={(e) => {
              validateInput(e.target.value);
              setMessage(e.target.value);
            }}
            id="feedback"
            rows={10}
            className="text-area"
            placeholder="Write your message here !"
          ></textarea>
          {formError ? <p className="error-text-area"></p> : null}
          <button type="submit" className="feedback-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
