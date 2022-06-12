import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SideMobile from "../Sidenav/SideMobile";
import { BACKEND_URL } from "../../../constants/url";

import { IoNotificationsOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { Button } from "@mui/material";
import logo from "../../../Images/default.svg";
import MenuIcon from "@mui/icons-material/Menu";

export default function ({ active }) {
  const channelDetails = useSelector((state) => state.channelDetails);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const closeSide = () => {
    setOpen(false);
  };
  const openSide = () => {
    setOpen(true);
  };


  return (
    <div className="admin-header w-100">
      <Container>
        <Row>
          <Col className="creator-head-left">
            <MdDashboard style={{ fontSize: "30px", marginTop: "-12px" }} />
            <span className="page-title ms-2">Dashboard</span>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="admin-name hide-mob pointer"
            onClick={()=>{
              navigate('/creator/settings')
            }}
            >
              {channelDetails.channel?.name}
            </p>
            <img
              className="admin-dp pointer"
              src={
                channelDetails.channel === null
                  ? logo
                  : `${BACKEND_URL}/uploads/${channelDetails.channel?.image}`
              }
              alt=""
              onClick={()=>{
                navigate('/creator/settings')
              }}
            ></img>
            <Button
              className="creator-mobile-btn d-none"
              onClick={() => {
                openSide();
              }}
            >
              <MenuIcon />
            </Button>
          </Col>
        </Row>
      </Container>
      <SideMobile open={open} closeSide={closeSide} active={active} />
    </div>
  );
}
