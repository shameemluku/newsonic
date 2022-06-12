import React, { useEffect } from "react";
import Header from "../../components/Admin/Header/Header";
import Sidenav from "../../components/Admin/Sidenav/Sidenav";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getChannelDetails } from "../../actions/channelActions";
import { useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import "../../components/Admin/Admin.css";
import { verifyUser } from "../../actions/userActions";
import { LinearProgress } from "@mui/material";

export default function Creator({ children, active }) {
  const {
    authUser: authData,
    channelDetails,
    creatorSelectedPost,
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Creator - Newsonic`
    dispatch(verifyUser());
    if (authData.user?.isCreator) {
      dispatch(getChannelDetails());
    } else {
      navigate("/creator/register");
    }
  }, []);

  return (
    <>
      <style>{"body {background-color:#edf0f5;}"}</style>
      {channelDetails.channel?.isApproved &&
      !channelDetails.channel?.isBlocked ? (
        <>
          {creatorSelectedPost.loading && (
            <div className="creator-progress">
              <LinearProgress color="success" sx={{ height: "10px" }} />
            </div>
          )}

          <Sidenav active={active} />
          <div className="main-content">
            <Container>
              <Header active={active} />

              {children}
            </Container>
          </div>
        </>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
