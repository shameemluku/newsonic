import React, { useEffect, useState } from "react";
import { Nav, Navbar, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/mainlogo.svg";
import Login from "../Login/Login";
import "./Header.css";

import { RiFacebookCircleLine, RiInstagramLine } from "react-icons/ri";
import { IoLogoTwitter } from "react-icons/io";
import { AiFillCaretRight } from "react-icons/ai";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../../actions/userActions";
import { BACKEND_URL } from "../../constants/url";
import { getCategory } from "../../api";
import { Avatar } from "@mui/material";

export default function Header({next}) {
  const [modalShow, setModalShow] = React.useState(false);
  const {authUser:authData, loginModal, posts} = useSelector((state) => state);
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState([]);
  const [showDrop, setDropmenu] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [headerNews, setHeaderNews] = useState(posts[Math.floor(Math.random() * posts.length) + 1])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(authData.user !== null){
      setUser(authData)
    }else{
      setUser(null)
    }

    (async () => setCategory([...(await getCategory()).data.categories]))()


  }, [authData]);

  useEffect(()=>{
    console.log(category);
  },[category])

 

  useEffect(()=>{
    if(loginModal){
      setModalShow(true);
    }
  },[loginModal])

  useEffect(()=>{
    if(next!==null && next>0.2) setShowNext(true) 
    else setShowNext(false) 
  },[next])


  useEffect(()=>{
    setHeaderNews(posts[Math.floor(Math.random() * 6) + 1])
  },[posts])

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
            { !showNext ?
            <Nav className="me-auto mt-1">
           
              {
                category !==null &&
                category.map((val,i)=>{
                  if(i<8)return (<Nav.Link href={`/category/${val.name}`} className="navlinks">
                    {val.name}
                  </Nav.Link>)
                })
              }
              

            </Nav>
            :
            <div className="w-100 header-next" onClick={
              ()=>{
                navigate(`/post/${headerNews?._id}`)
                window.location.reload()
              }
            }>
               <img 
                src={`${BACKEND_URL}/uploads/${headerNews?.images[0]}`}
                alt=""
                height={"30px"}
                />
                <p className="next-txt mx-2 mb-0">Next up:</p>
               <p className="nav-news-title mb-0">{headerNews?.newsHead.slice(0,40)}...</p>
               <p className="ms-3 mb-0">
                 <AiFillCaretRight color="#0ba82d"/>
                 <AiFillCaretRight color="#0ba82d"/>
               </p>
            </div>
            }
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

                  <Nav.Link
                    eventKey={2}
                    className="navlinks d-flex"
                  >

                      <Avatar style={{width:"30px",height:"30px"}}>{authData.user?.name[0]}</Avatar>
                    {/* <span className="profileLetter">{authData.user?.name[0]}</span> */}
                    <span className="profileText">{authData.user?.name}</span>
                    
                  </Nav.Link>

                  <Dropdown className="d-inline mx-2">
                    <Dropdown.Toggle id="dropdown-autoclose-true" className="dropBtn"></Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#"><IoSettingsOutline className="me-2"/>Settings</Dropdown.Item>
                      <Dropdown.Item href="#">
                        <Link to="/creator/" className="console-link"><div className="console-btn">Go to Console</div></Link>
                      </Dropdown.Item>
                      <Dropdown.Item href="#" onClick={handleLogout}><IoLogOutOutline className="me-2"/>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>



                  {/* <div className="d-flex">
                    <span className="profileLetter">{authData.user?.name[0]}</span>
                    <span className="profileText">{authData.user?.name}</span>

                    <Dropdown className="d-inline mx-2">
                      <Dropdown.Toggle id="dropdown-autoclose-true" className="dropBtn"></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#"><IoSettingsOutline className="me-2"/>Settings</Dropdown.Item>
                        <Dropdown.Item href="#">
                          <Link to="/creator/"><div className="console-btn">Go to Console</div></Link>
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={handleLogout}><IoLogOutOutline className="me-2"/>Logout</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div> */}
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
