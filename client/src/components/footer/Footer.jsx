import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="footer-row">
          <div className="footer-first-p">
            <h6>About</h6>
            <p className="">
              Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative to
              help the upcoming programmers with the code. Scanfcode focuses on
              providing the most efficient code or snippets as the code wants to
              be simple. We will help programmers build up concepts in different
              programming languages that include C, C++, Java, HTML, CSS,
              Bootstrap, JavaScript, PHP, Android, SQL and Algorithm.
            </p>
          </div>

          <div className="footer-sec-p">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li>
                <a href="http://scanfcode.com/category/c-language/">C</a>
              </li>
              <li>
                <a className="http://scanfcode.com/category/front-end-development/">
                  UI Design
                </a>
              </li>
              <li>
                <a className="http://scanfcode.com/category/back-end-development/">
                  PHP
                </a>
              </li>
              <li>
                <a className="http://scanfcode.com/category/java-programming-language/">
                  Java
                </a>
              </li>
              <li>
                <a className="http://scanfcode.com/category/android/">
                  Android
                </a>
              </li>
              <li>
                <a className="http://scanfcode.com/category/templates/">
                  Templates
                </a>
              </li>
            </ul>
          </div>

          <div class="footer-sec-p">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <li>
                <a href="http://scanfcode.com/about/">About Us</a>
              </li>
              <li>
                <a href="http://scanfcode.com/contact/">Contact Us</a>
              </li>
              <li>
                <a href="http://scanfcode.com/contribute-at-scanfcode/">
                  Contribute
                </a>
              </li>
              <li>
                <a href="http://scanfcode.com/privacy-policy/">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="http://scanfcode.com/sitemap/">Sitemap</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container-for-footer-row">
        <div class="footer-second-row">
          <div class="">
            <p class="copyright-text">
              Copyright &copy; 2017 All Rights Reserved by
              <a href="#">Scanfcode</a>.
            </p>
          </div>

          <div class="">
            <ul class="social-icons">
              <li>
                <a class="facebook" href="#">
                  <i class="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a class="twitter" href="#">
                  <i class="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a class="dribbble" href="#">
                  <i class="fa fa-dribbble"></i>
                </a>
              </li>
              <li>
                <a class="linkedin" href="#">
                  <i class="fa fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
