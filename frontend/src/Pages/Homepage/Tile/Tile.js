import React, { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_POST_DETAILS } from "../../../constants/actionTypes";
import { BACKEND_URL as URL } from "../../../constants/url";
import Slider from "../Slider/Slider";
import "./Tile.css";
import thumb from "../../../Images/gray-thumb.jpg"
import { Skeleton } from "@mui/material";

export default function Tile() {
  const [navNews, setNavNews] = useState([]);
  const { loginModal, posts } = useSelector((state) => state);
  const [newsPosts, setNewsPosts] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const newsArray = [
    {
      category: "Sports",
      news: "This is a Sports news. The First Lady' reframes U.S. leadership through the eyes of the women behind the scenes",
    },
    {
      category: "Technology",
      news: "The First Tehnology of mobile was a revolution. It made our life happy",
    },
    {
      category: "Entertainment",
      news: "The First Lady' reframes U.S. leadership through the eyes of the women behind the scenes",
    },
  ];

  let index = 0;
  let index2 = newsArray.length - 1;
  useEffect(() => {
    setNavNews([...navNews, newsArray[index], newsArray[index2]]);
    changeText();
  }, []);

  useEffect(() => {
    console.log(newsPosts);
    setNewsPosts([...posts.sort((a, b) => 0.5 - Math.random())])
  }, [posts]);

  function changeText() {
    index++;
    index2++;
    if (index === newsArray.length || index < 0) {
      index = 0;
    }
    if (index2 === newsArray.length || index < 0) {
      index2 = 0;
    }
    setTimeout(() => {
      setNavNews([...navNews, newsArray[index], newsArray[index2]]);
      changeText();
    }, 3000);
  }

  return (
    <>
      <Container style={{ marginTop: "100px" }}>
        <div className="navline mb-3 d-flex align-items-center ">
          <div style={{ overflow: "hidden" }}>
            {navNews.length > 0 ? (
              <span className="navline-cat fadeIn">{navNews[0].category}</span>
            ) : (
              <span className="navline-cat">Loading..</span>
            )}
            {navNews.length > 0 ? (
              <span className="ms-2 navline-text" style={{ color: "white" }}>
                {navNews[0].news.length > 70
                  ? navNews[0].news.substring(0, 70)
                  : navNews[0].news}
              </span>
            ) : (
              "Loading"
            )}
          </div>

          <div style={{ overflow: "hidden" }}>
            {navNews.length > 0 ? (
              <span className="navline-cat fadeIn">{navNews[1].category}</span>
            ) : (
              <span className="navline-cat">Loading..</span>
            )}
            {navNews.length > 0 ? (
              <span className="ms-2 navline-text" style={{ color: "white" }}>
                {navNews[1].news.length > 70
                  ? navNews[0].news.substring(0, 70)
                  : navNews[1].news}
              </span>
            ) : (
              "Loading"
            )}
          </div>
        </div>
        <Container>
          <Row className="tiles">
            <Col
              xs={12}
              lg={6}
              className="tile pointer hoverZoom p-0"
              style={{
                backgroundImage:`url(${thumb}`,
                position: "relative",
                backgroundPosition: "center",
              }}
              onLoadedData={()=>{alert("Hi")}}
              onClick={()=>{
                navigate(`/post/${newsPosts[0]._id}`)
                dispatch({
                  type:SET_POST_DETAILS,
                  payload:newsPosts[0]
                })
              }}
            >
              <span className="title-bg">
                <span className="category">
                  {newsPosts.length !== 0
                    ? newsPosts[0].category.map((val, i) => {
                        if (i !== newsPosts[0].category.length - 1)
                          return val + " | ";
                        return val;
                      })
                    : 
                    <>
                      <Skeleton width={"50%"} sx={{ bgcolor: '#969696' }}/>
                    </>
                    }
                </span>
                <br></br>
                <span className="title">
                  {newsPosts.length !== 0 ? newsPosts[0].newsHead : 
                    <>
                      <Skeleton sx={{ bgcolor: '#969696' }}/>
                      <Skeleton width={"80%"} sx={{ bgcolor: '#969696' }}/>
                    </>}
                </span>
              </span>
              

              <img className="w-100 tile-image" 
                src={`${URL}/uploads/${newsPosts.length !== 0 ? newsPosts[0].images[0] : thumb }`} 
                height="100%" alt={""} 
              ></img>


            </Col>
            <Col xs={12} lg={4} className="sec-tile">
              <div
                className="sub-tile bg-dark align-item-top mt-md-0 mt-2 hoverZoom pointer"
                style={{
                  backgroundImage: `url(${thumb}`,
                  position: "relative",
                  backgroundPosition: "center",
                  overflow:"hidden"
                }}
                onClick={()=>{
                  navigate(`/post/${newsPosts[1]._id}`)
                  dispatch({
                    type:SET_POST_DETAILS,
                    payload:newsPosts[1]
                  })
                }}
              >
                <span className="title-bg title-bg-sm">
                  <span className="category">
                    {newsPosts.length !== 0
                      ? newsPosts[1].category.map((val, i) => {
                          if (i !== newsPosts[1].category.length - 1)
                            return val + " | ";
                          return val;
                        })
                      : <><Skeleton width={"50%"} sx={{ bgcolor: '#969696' }}/></>}
                  </span>
                  <br></br>
                  <span className="title-sm">
                    {newsPosts.length !== 0 ? newsPosts[1].newsHead : 
                    <>
                      <Skeleton sx={{ bgcolor: '#969696' }}/>
                      <Skeleton width={"80%"} sx={{ bgcolor: '#969696' }}/>
                    </>}
                  </span>
                </span>

                <img className="w-100 tile-image" 
                src={`${URL}/uploads/${newsPosts.length !== 0 ? newsPosts[1].images[0] : thumb }`} 
                height="100%" alt={""} 
              ></img>
              </div>



              <div
                className="sub-tile bg-danger mt-2 mt-md-3 hoverZoom pointer"
                style={{
                  backgroundImage: `url(${thumb}`,
                  backgroundPosition: "center",
                  overflow:"hidden"
                }}
                onClick={()=>{
                  navigate(`/post/${newsPosts[2]._id}`)
                  dispatch({
                    type:SET_POST_DETAILS,
                    payload:newsPosts[2]
                  })
                }}
              >
                <span className="title-bg title-bg-sm">
                  <span className="category">
                  {newsPosts.length !== 0
                      ? newsPosts[2].category.map((val, i) => {
                          if (i !== newsPosts[2].category.length - 1)
                            return val + " | ";
                          return val;
                        })
                      : 
                      <><Skeleton width={"50%"} sx={{ bgcolor: '#969696' }}/></>
                      }
                  </span>
                  <br></br>
                  <span className="title-sm">
                  {newsPosts.length !== 0 ? newsPosts[2].newsHead : 
                    <>
                      <Skeleton sx={{ bgcolor: '#969696' }}/>
                      <Skeleton width={"80%"} sx={{ bgcolor: '#969696' }}/>
                    </>}
                  </span>
                </span>

                <img className="w-100 tile-image" 
                src={`${URL}/uploads/${newsPosts.length !== 0 ? newsPosts[2].images[0] : thumb }`} 
                height="100%" alt={""} 
              ></img>

              </div>
            </Col>
            <Col
              xs={12}
              lg={2}
              className="bg-danger tile mt-md-0 mt-2"
              style={{
                backgroundImage:
                  "url(https://www.skaggerz.nl/wp-content/uploads/2020/05/ads.jpg)",
              }}
            ></Col>
          </Row>
        </Container>
      </Container>
      
      <Slider data={newsPosts}/>

    </>
  );
}
