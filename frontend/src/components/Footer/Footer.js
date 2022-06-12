import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { DiGithubAlt } from "react-icons/di";
import { AiFillInstagram } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import "./FooterStyles.css";
import logo from "../../Images/logo-white.png";
import { Link } from "react-router-dom";
import { GrPaypal } from "react-icons/gr";
import { SiRazorpay } from "react-icons/si";

function FooterComp() {
  return (
    <div class="footer-dark">
      <footer>
        <div class="container">
          <div class="row">
            <div class="col-sm-6 col-md-3 item">
              <p className="fw-500 f-17">Categories</p>
              <ul>
                <li>
                  <Link to="/category/sports">Sports</Link>
                </li>
                <li>
                  <Link to="/category/business">Bussiness</Link>
                </li>
                <li>
                  <Link to="/category/entertainment">Entertainment</Link>
                </li>
                <li>
                  <Link to="/category/education">Educational</Link>
                </li>
                <li>
                  <Link to="/category/technology">Technology</Link>
                </li>
                <li>
                  <Link to="/category/politics">Politics</Link>
                </li>
                <li>
                  <Link to="/category/movies">Movies</Link>
                </li>
              </ul>
            </div>
            <div class="col-sm-6 col-md-3 item">
              <p className="fw-500 f-17">Services</p>
              <ul>
                <li>
                  <Link to="/sponsor">Sponsor an Ad</Link>
                </li>
                <li>
                  <Link to="/creator">Become a Creator</Link>
                </li>
                <li>
                  <Link to="/">API</Link>
                </li>
              </ul>
            </div>

            <div class="col-sm-6 col-md-3 item">
              <p className="fw-500 f-17">Supported Payments</p>
              <ul>
                <li>
                  <GrPaypal /> PayPal
                </li>
                <li>
                  <SiRazorpay /> Razorpay
                </li>
              </ul>
            </div>
            <div class="col-md-3 item text">
              <img src={logo} height={15}></img>
              <p className="mt-2">
                Latest India News, Breaking News, Today Headlines and Live News
                Online - Newsonic provides the latest news from India and around
                the world
              </p>
            </div>
            <div class="col item social mt-3">
              <span
                className="pointer"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/shameemlukmanpk/`,
                    "_blank"
                  )
                }
              >
                <FaFacebookF />
              </span>
              <span
                className="pointer"
                onClick={() =>
                  window.open(
                    `https://github.com/shameemluku/`,
                    "_blank"
                  )
                }
              >
                <DiGithubAlt />
              </span>
              <span
                className="pointer"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/shameemluku/`,
                    "_blank"
                  )
                }
              >
                <AiFillInstagram />
              </span>
              <span
                className="pointer"
                onClick={() =>
                  window.open(
                    `https://twitter.com/shameemluku`,
                    "_blank"
                  )
                }
              >
                <BsTwitter />
              </span>
            </div>
          </div>
          <p class="copyright">Newsonic © 2022 | Developed by Shameem Lukman</p>
        </div>
      </footer>
    </div>
  );
}

export default FooterComp;
