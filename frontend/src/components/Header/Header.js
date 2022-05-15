import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../Images/mainlogo.svg";
import Login from "../Login/Login";
import "./Header.css";

import { RiFacebookCircleLine, RiInstagramLine } from "react-icons/ri";
import { IoLogoTwitter } from "react-icons/io";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../actions/userActions";

export default function Header() {
  const [modalShow, setModalShow] = React.useState(false);
  const [user, setUser] = useState(null);
  const {authUser:authData, loginModal} = useSelector((state) => state);
  const [showDrop, setDropmenu] = useState(false);

  const dispatch = useDispatch()

  useEffect(() => {
    if(authData.user !== null){
      setUser(authData)
    }else{
      setUser(null)
    }

  }, [authData]);


  useEffect(()=>{
    if(loginModal){
      setModalShow(true);
    }
  },[loginModal])

  const handleDropmenu = () => {
    setDropmenu(!showDrop);
  };

  const handleLogout = () => {
    dispatch(signOut())
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        fixed="top"
        style={{ backgroundColor: "white" }}
      >
        <Container className="mt-3 mb-3">
          <Navbar.Brand href="/">
            <img src={logo} height="26px" alt="logo"></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#features" className="ms-5 navlinks">
                LIVE
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                TV
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                LATEST
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                COVID
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                INDIA
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                OPINION
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                VIDEO
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                CITIES
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                WORLD
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                TRENDS
              </Nav.Link>
              <Nav.Link href="#pricing" className="navlinks">
                PHOTO
              </Nav.Link>
            </Nav>
            <Nav>
              {authData.user===null ? (
                <>
                  <div className="d-flex">
                    <Nav.Link
                      href="#pricing"
                      className="navlinks"
                      style={{ fontSize: "20px" }}
                    >
                      <FaFacebook />
                    </Nav.Link>
                    <Nav.Link
                      href="#pricing"
                      className="navlinks"
                      style={{ fontSize: "20px" }}
                    >
                      <RiInstagramLine />
                    </Nav.Link>
                    <Nav.Link
                      href="#pricing"
                      className="navlinks"
                      style={{ fontSize: "20px" }}
                    >
                      <IoLogoTwitter />
                    </Nav.Link>
                  </div>
                  <Nav.Link
                    eventKey={2}
                    className="navlinks mt-1"
                    onClick={() => {
                      setModalShow(true);
                    }}
                  >
                    Login
                  </Nav.Link>
                </>
              ) : (
                <>
                  <div className="d-flex">
                    <span className="profileLetter">{authData.user?.name[0]}</span>
                    <span className="profileText">{authData.user?.name}</span>

                    <Dropdown className="d-inline mx-2">
                      <Dropdown.Toggle id="dropdown-autoclose-true" className="dropBtn"></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#"><IoSettingsOutline className="me-2"/>Settings</Dropdown.Item>
                        <Dropdown.Item href="#">
                          <Link to="/creator/add"><div className="console-btn">Go to Console</div></Link>
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={handleLogout}><IoLogOutOutline className="me-2"/>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Login show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
}
