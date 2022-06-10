import { Button } from "@mui/material";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "../../../components/Header/Header";
import bgElem from "../../../Images/spon-home-elem.png";
import dots from "../../../Images/dots.svg";
import "./SponsorHome.css";
import Typewriter from "typewriter-effect";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FooterComp from "../../../components/Footer/Footer";

const SponsorHome = () => {
  const { authUser: authData } = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <Header hide={true} />
      <Container>
        <div className="sponsor-main-content mb-5">
          <Row className="w-100">
            <Col
              lg={6}
              className="spon-col-left"
              style={{
                background: `url(${dots})`,
                backgroundSize: "200px",
                backgroundRepeat: "no-repeat",
                backgroundPositionX: "400px",
                backgroundPositionY: "70px",
              }}
            >
              <div className="left-holder ms-5">
                
                {
                  authData.user!==null?
                  <>
                  <div className="spon-heading">
                  Hi,<br/>{authData.user?.name}
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter

                        .typeString("Welcome Back!")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("Have a nice day")
                        .start();
                    }}
                  />
                  </div>
                  </>
                  :
                  <>
                  <div className="spon-heading">
                  Grow your business with
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter

                        .typeString("Newsonic Ads")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("No.1 network")
                        .pauseFor(1000)
                        .deleteAll()
                        .typeString("Newsonic Ads")
                        .start();
                    }}
                  />
                  </div>
                  </>
                }


                <div className="content-center d-none handshake-left">
                <img src={bgElem} width={"100%"} alt="" />
                </div>
    

                <p className="spon-home-desc">
                  Grow online sales, bookings or mailing list signups with
                  online ads that direct people to your website
                </p>
                <Button
                  className="spon-home-btn"
                  variant="contained"
                  onClick={() => {
                    if (authData.user !== null) {
                      navigate("/sponsor/dashboard");
                    } else {
                      dispatch({
                        type: "SHOW_MODAL",
                      });
                    }
                  }}
                >
                  {authData.user === null ? "Get Started" : "Go to Dashboard"}
                </Button>
              </div>
            </Col>

            <Col lg={6} className="handshake-img p-0">
              <img src={bgElem} width={"100%"} alt="" />
            </Col>
          </Row>
        </div>
      </Container>
      <FooterComp/>
    </>
  );
};

export default SponsorHome;
