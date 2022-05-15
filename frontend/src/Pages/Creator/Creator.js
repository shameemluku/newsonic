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


export default function Creator({ children }) {

  const { authUser: authData, channelDetails } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate()





  useEffect(()=>{
    dispatch(verifyUser())
    if (authData.user?.isCreator) {
      dispatch(getChannelDetails());
    }else{
      navigate("/creator/register")
    }
  },[])


  



  return (
    <>

    <style>{"body {background-color:#F5F7FB;}"}</style>
      {channelDetails.channel?.isApproved ? (
        <>
          <Sidenav />
          <div className="main-content">
            <Container>
              <Header />

              {children}

            </Container>
          </div>
        </>
      ) : (
        <LandingPage/>
      )}


    </>
  );
}
