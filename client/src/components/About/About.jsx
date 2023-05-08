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
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
              minima nihil voluptate, maiores adipisci sed quibusdam similique
              necessitatibus cupiditate nesciunt eos quia sapiente cumque ut
              doloribus possimus odit. Asperiores, deleniti!
            </p>
          </div>
        </div>
        <div className="contact-us-container">
          <div>
            <p className="about-us-container-title">Contact Us..</p>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
              minima nihil voluptate, maiores adipisci sed quibusdam similique
              necessitatibus cupiditate nesciunt eos quia sapiente cumque ut
              doloribus possimus odit. Asperiores, deleniti!
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
