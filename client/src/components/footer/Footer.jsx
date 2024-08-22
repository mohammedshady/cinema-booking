import "./Footer.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Icon } from "@mui/material";

const Footer = () => {
  const icons = [
    { icon: <GitHubIcon /> },
    { icon: <LinkedInIcon /> },
    { icon: <InstagramIcon /> },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="footer-row">
          <div className="footer-first-p">
            <h6 style={{ marginBottom: 15 }}>About</h6>
            <p className="">
              Welcome to our website, where you can easily book movie tickets We
              understand the importance of enjoying a movie without any hassle,
              and that's why we have created a user-friendly platform to make
              your movie booking experience effortless. With just a few clicks,
              you can browse through the latest movie releases, select your
              preferred cinema location, and book your tickets at your preferred
              showtime. Our website is designed to provide you with a seamless
              booking experience, allowing you to make secure payments and
              receive e-tickets that can be easily redeemed at the cinema.
            </p>
          </div>

          <div className="footer-sec-p">
            <h6 style={{ marginBottom: 15 }}>Find US</h6>
            <ul className="footer-links">
              {details.map((item) => (
                <li>
                  <a href="">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="footer-sec-p">
            <h6>Categories</h6>
            <ul className="footer-links">
              {details.map((item) => (
                <li>
                  <a href="">{item}</a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </div>

      <div class="container-for-footer-row">
        <div class="footer-second-row">
          <div class="">
            <p class="copyright-text">
              Copyright &copy; 2023 All Rights Reserved by
              <a href="#"> {" Mohammed"}</a>.
            </p>
          </div>

          <div class="">
            <ul class="social-icons">
              {icons.map((icon) => (
                <li>
                  <a href="">{icon.icon}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

const techs = ["C", "UI Design", "PHP", "Java", "Android"];
const details = ["Contact Us", "About US", "Locating", "FAQ"];
