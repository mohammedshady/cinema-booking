import contactUsImage from "../../assets/images/contact_us.svg";
import aboutUsImage from "../../assets/images/about_us.svg";
import Navbar from "../navBar/Navbar";
import Footer from "../footer/Footer";
import "./About.css";

const About = () => {
  return (
    <div className="whole-about-container">
      <Navbar />
      <div className="about-page-container">
        <div className="about-us-container">
          <div>
            <img src={aboutUsImage} className="about-us-for-image" />
          </div>
          <div>
            <p className="about-us-container-title">About Us..</p>
            <p>
              Our movie booking website was founded with the goal of making it
              easy and convenient for movie-goers to book tickets online. We
              strive to provide a seamless user experience and make the ticket
              booking process hassle-free. Our website features a user-friendly
              interface
            </p>
          </div>
        </div>
        <div className="contact-us-container">
          <div>
            <p className="about-us-container-title">Contact Us..</p>
            <p>
              If you have any questions or feedback, please don't hesitate to
              contact us. You can reach us at
              <p className="in-p-details">support@moviebooking.com</p>
              <p className="in-p-details">+1-123-456-7890.</p>
            </p>
          </div>
          <div>
            <img src={contactUsImage} className="contact-us-for-image" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default About;
