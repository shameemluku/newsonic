import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { RiFacebookCircleLine, RiInstagramLine } from "react-icons/ri";
import { IoLogoTwitter, IoMdLock } from "react-icons/io";
import { AiFillCaretRight } from "react-icons/ai";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { BiMoney } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../actions/userActions";
import { BACKEND_URL } from "../../constants/url";
import { getNavlinks } from "../../api";
import { Avatar } from "@mui/material";
import Login from "../Login/Login";
import logo from "../../Images/mainlogo.svg";
import Hamburger from "hamburger-react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Header.css";

export default function Header({ next, hide }) {
  const [modalShow, setModalShow] = React.useState(false);
  const {
    authUser: authData,
    loginModal,
    posts,
  } = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState([]);
  const [catLen, setCatLen] = useState(8);
  const [showDrop, setDropmenu] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [headerNews, setHeaderNews] = useState(
    posts[Math.floor(Math.random() * posts.length) + 1]
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authData.user !== null) {
      setUser(authData);
    } else {
      setUser(null);
    }

    (async () => setCategory([...(await getNavlinks()).data.categories]))();
  }, [authData]);

  useEffect(() => {
    if (loginModal) {
      setModalShow(true);
      setOpen(false);
    }
  }, [loginModal]);

  useEffect(() => {
    setOpen(false);
  }, [modalShow]);

  useEffect(() => {
    if (next !== null && next > 0.2) setShowNext(true);
    else setShowNext(false);
  }, [next]);

  useEffect(() => {
    setHeaderNews(posts[Math.floor(Math.random() * 6) + 1]);
  }, [posts]);

  const handleDropmenu = () => {
    setDropmenu(!showDrop);
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth < 1200 && window.innerWidth > 992) setCatLen(5);
        else setCatLen(8);
      },
      false
    );
  }, []);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        fixed="top"
        style={{ backgroundColor: "white" }}
      >
        <Container className="mt-3 mb-3">
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} height="26px" alt="logo"></img>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav">
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </Navbar.Toggle>
          <Navbar.Collapse id="responsive-navbar-nav">
            {showNext && window.innerWidth > 992 ? (
              <div
                className="w-100 header-next"
                onClick={() => {
                  navigate(`/post/${headerNews?._id}`);
                  window.location.reload();
                }}
              >
                <img
                  src={`${BACKEND_URL}/uploads/${headerNews?.images[0]}`}
                  alt=""
                  height={"30px"}
                />
                <p className="next-txt mx-2 mb-0">Next up:</p>
                <p className="nav-news-title mb-0">
                  {headerNews?.newsHead.slice(0, 40)}...
                </p>
                <p className="ms-3 mb-0">
                  <AiFillCaretRight color="#0ba82d" />
                  <AiFillCaretRight color="#0ba82d" />
                </p>
              </div>
            ) : (
              <>
                {!hide ? (
                  <Nav className="navlink-holder me-auto mt-1">
                    {category !== null &&
                      category.map((val, i) => {
                        if (i < catLen)
                          return (
                            <Nav.Link className="navlinks nav-cat-links">
                              <Link to={`/category/${val.name}`}>
                                {val.name}
                              </Link>
                            </Nav.Link>
                          );
                      })}
                  </Nav>
                ) : (
                  <Nav className="me-auto mt-1"></Nav>
                )}
              </>
            )}
            <Nav>
              {authData.user === null ? (
                <>
                  <div className="navbar-drop-seperator my-2 d-none" />

                  <div className="d-flex">
                    <Nav.Link
                      href="https://www.facebook.com/shameemlukmanpk/"
                      className="navlinks nav-social"
                      style={{ fontSize: "20px" }}
                    >
                      <FaFacebook />
                    </Nav.Link>
                    <Nav.Link
                      href="https://www.instagram.com/shameemluku/"
                      className="navlinks nav-social"
                      style={{ fontSize: "20px" }}
                    >
                      <RiInstagramLine />
                    </Nav.Link>
                    <Nav.Link
                      href="https://twitter.com/shameemluku"
                      className="navlinks nav-social"
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
                    <div className="d-flex">
                      <IoMdLock className="login-lock d-none" />
                      Login
                    </div>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <div className="navbar-drop-seperator my-2 d-none" />

                  <Nav.Link
                    eventKey={2}
                    className="navlinks d-flex"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    {/* <Avatar style={{width:"30px",height:"30px"}}>{authData.user?.name[0]}</Avatar> */}
                    <Avatar
                      style={{ width: "30px", height: "30px" }}
                      alt={authData.user?.name}
                      src={
                        authData.user?.image
                          ? `${BACKEND_URL}/uploads/${authData.user?.image}`
                          : null
                      }
                    />
                    <span className="profileText">{authData.user?.name}</span>
                  </Nav.Link>

                  <div className="nav-profile-holder mt-3 d-none">
                    <p>
                      <Link to="/creator" className="nav-profile-links">
                        <DashboardIcon className="me-2" />
                        Go to Console
                      </Link>
                      <br />
                    </p>
                    <p>
                      <Link to="/sponsor" className="nav-profile-links">
                        <MonetizationOnIcon className="me-2" />
                        Become Sponsor
                      </Link>
                    </p>
                    <p>
                      <Link to="" className="nav-profile-links" onClick={handleLogout}>
                        <LogoutIcon className="me-2" />
                        Logout
                      </Link>
                    </p>
                  </div>

                  <Dropdown className="nav-profile-drop d-inline mx-2">
                    <Dropdown.Toggle
                      id="dropdown-autoclose-true"
                      className="dropBtn"
                    ></Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#">
                        <Link
                          to="/sponsor/"
                          className="console-link nav-sponsor-link"
                        >
                          <BiMoney className="me-2 mb-1" />
                          Be a Sponsor
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        <Link to="/creator/" className="console-link">
                          <div className="console-btn">Go to Console</div>
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        <Link
                          to="/profile/"
                          className="console-link nav-sponsor-link"
                        >
                          <IoSettingsOutline className="me-2" />
                          Settings
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#" onClick={handleLogout}>
                        <IoLogOutOutline className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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
