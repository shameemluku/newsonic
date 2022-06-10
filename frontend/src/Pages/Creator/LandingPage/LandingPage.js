import React from "react";
import "./LandingPage.css";
import logo from "../../../Images/mainlogo.svg";
import loadingGif from "../../../Images/loading.gif";
import defaultPic from "../../../Images/default.jpg";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../constants/url";

function LandingPage() {
  const { channelDetails } = useSelector((state) => state);

  return (
    <div className="body-div">
      <div className="mainContent mb-5 align-vertical">
        <div className="content-center">
          <span>
            <div>Creator</div>
            <img src={logo} alt="" className="creator-logo"></img>
          </span>
        </div>

        {channelDetails.loading ? (
          <>
            <div className="content-center">
              <img height={"200px"} src={loadingGif} alt=""></img>
            </div>

            <div className="content-center">
              <span className="wait-desc-text">
                Please wait, Loading console account...
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="content-center mt-5">
              <div className="channel-name-box d-flex">
                <div>
                  <img
                    src={`${BACKEND_URL}/uploads/${channelDetails?.channel?.image}`}
                    alt="dp"
                  ></img>
                </div>
                <div>
                  <div className="name mb-1">
                    {channelDetails?.channel?.name}
                  </div>
                  {!channelDetails?.channel?.isApproved ? (
                    <>
                      <span className="approve-status">Pending approval</span>
                    </>
                  ) : (
                    <>
                      {channelDetails.channel?.isBlocked && (
                        <span className="approve-status block-status">
                          Channel Blocked
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="content-center mt-5">
              <Link to="/" className="noline">
                <div className="creator-goback-btn mt-3">
                  <BiArrowBack className="me-1" />
                  Go back to home
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
