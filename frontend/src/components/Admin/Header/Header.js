import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import logo from "../../../Images/default.svg";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../../constants/url";
import SideMobile from "../Sidenav/SideMobile";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";

export default function ({ active }) {
  const channelDetails = useSelector((state) => state.channelDetails);
  const [open, setOpen] = useState(false);

  const closeSide = () => {
    setOpen(false);
  };
  const openSide = () => {
    setOpen(true);
  };

  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <div className="admin-header w-100">
      <Container>
        <Row>
          <Col className="creator-head-left">
            <MdDashboard style={{ fontSize: "30px", marginTop: "-12px" }} />
            <span className="page-title ms-2">Dashboard</span>
          </Col>
          <Col className="d-flex justify-content-end">
            <p className="admin-name hide-mob">
              {channelDetails.channel?.name}
            </p>
            <img
              className="admin-dp"
              src={
                channelDetails.channel === null
                  ? logo
                  : `${BACKEND_URL}/uploads/${channelDetails.channel?.image}`
              }
              alt=""
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
