import React, { useEffect, useState } from "react";
import { 
  Col, 
  Row, 
  Container 
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { SET_POST_DETAILS } from "../../../constants/actionTypes";
import { clickAd, displayAd } from "../../../actions/adActions";
import { BACKEND_URL, BACKEND_URL as URL } from "../../../constants/url";
import Slider from "../Slider/Slider";
import thumb from "../../../Images/gray-thumb.jpg";
import PaidIcon from "@mui/icons-material/Paid";
import adpic from "../../../Images/ad1.jpg";
import "./Tile.css";

export default function Tile() {
  const [navNews, setNavNews] = useState([]);
  const { loginModal, posts, authUser } = useSelector((state) => state);
  const [newsPosts, setNewsPosts] = useState([]);
  const [ad, setAd] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setNewsPosts([...posts.sort((a, b) => 0.5 - Math.random())]);
    if (posts.length > 0) {
      setNavNews([...posts.sort((a, b) => 0.5 - Math.random())]);
      changeText();
    }
  }, [posts]);

  function changeText() {
    setTimeout(() => {
      setNavNews([...posts.sort((a, b) => 0.5 - Math.random())]);
      changeText();
    }, 7000);
  }

  useEffect(() => {
    (async () => {
      let adParams = {
        format: "FRM1",
      };
      setAd(await displayAd(adParams));
    })();
  }, [authUser]);

  const handleAdClick = async (url) => {
    let adParams = {
      format: "FRM2",
      adId: ad._id,
      sponsorId: ad.sponsorId,
    };

    clickAd(adParams);
    window.open(`https://${url}`, "_blank");
  };

  return (
    <>
      <Container style={{ marginTop: "110px" }}>
        <div className="navline mb-3 d-flex align-items-center ">
          <Row className="w-100">
            <Col lg={6} className="parent-row">
              {navNews.length > 0 ? (
                <div
                  style={{ overflow: "hidden" }}
                  className="pointer"
                  onClick={() => {
                    navigate(`/post/${navNews[0]?._id}`);
                  }}
                >
                  <span className="navline-cat fadeIn">
                    {navNews[0]?.category[0].toUpperCase()}
                  </span>

                  <span
                    className="ms-2 navline-text"
                    style={{ color: "white" }}
                  >
                    {navNews[0]?.newsHead}
                  </span>
                </div>
              ) : (
                <div className="d-flex">
                  <Skeleton
                    sx={{ bgcolor: "#3b3b3b" }}
                    variant="rectangle"
                    width="20%"
                    className="ms-3 mt-1"
                  />
                  <Skeleton
                    sx={{ bgcolor: "#3b3b3b" }}
                    variant="rectangle"
                    width="80%"
                    className="ms-2 mt-1"
                  />
                </div>
              )}
              <div className="gradient-black"></div>
            </Col>
            <Col lg={6} className="pe-0">
              <div
                style={{ overflow: "hidden" }}
                className="pointer w-100 parent-row"
                onClick={() => {
                  navigate(`/post/${navNews[1]?._id}`);
                }}
              >
                {navNews.length > 0 ? (
                  <>
                    <span className="navline-cat fadeIn ms-0">
                      {navNews[1]?.category[0].toUpperCase()}
                    </span>
                    <span
                      className="ms-2 navline-text"
                      style={{ color: "white" }}
                    >
                      {navNews[1]?.newsHead}
                    </span>
                  </>
                ) : (
                  <div className="d-flex">
                    <Skeleton
                      sx={{ bgcolor: "#3b3b3b" }}
                      variant="rectangle"
                      width="20%"
                      className="ms-3 mt-1"
                    />
                    <Skeleton
                      sx={{ bgcolor: "#3b3b3b" }}
                      variant="rectangle"
                      width="80%"
                      className="ms-2 mt-1"
                    />
                  </div>
                )}

                <div className="gradient-black"></div>
              </div>
            </Col>
          </Row>
        </div>

        <Container>
          <Row className="tiles">
            <Col
              xs={12}
              lg={6}
              className="tile pointer hoverZoom p-0"
              style={{
                backgroundImage: `url(${thumb}`,
                position: "relative",
                backgroundPosition: "center",
              }}
              onLoadedData={() => {
                alert("Hi");
              }}
              onClick={() => {
                navigate(`/post/${newsPosts[0]._id}`);
                dispatch({
                  type: SET_POST_DETAILS,
                  payload: newsPosts[0],
                });
              }}
            >
              <span className="title-bg">
                <span className="category">
                  {newsPosts.length !== 0 ? (
                    newsPosts[0].category.map((val, i) => {
                      if (i !== newsPosts[0].category.length - 1)
                        return val + " | ";
                      return val;
                    })
                  ) : (
                    <>
                      <Skeleton width={"50%"} sx={{ bgcolor: "#969696" }} />
                    </>
                  )}
                </span>
                <br></br>
                <span className="title">
                  {newsPosts.length !== 0 ? (
                    newsPosts[0].newsHead
                  ) : (
                    <>
                      <Skeleton sx={{ bgcolor: "#969696" }} />
                      <Skeleton width={"80%"} sx={{ bgcolor: "#969696" }} />
                    </>
                  )}
                </span>
              </span>

              <img
                className="w-100 tile-image"
                src={`${URL}/uploads/${
                  newsPosts.length !== 0 ? newsPosts[0].images[0] : thumb
                }`}
                height="100%"
                alt={""}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                onLoad={(e) => {
                  e.target.style.display = "inline-block";
                }}
              ></img>
            </Col>
            <Col xs={12} lg={4} className="sec-tile">
              <div
                className="sub-tile bg-dark align-item-top mt-md-0 mt-2 hoverZoom pointer"
                style={{
                  backgroundImage: `url(${thumb}`,
                  position: "relative",
                  backgroundPosition: "center",
                  overflow: "hidden",
                }}
                onClick={() => {
                  navigate(`/post/${newsPosts[1]._id}`);
                  dispatch({
                    type: SET_POST_DETAILS,
                    payload: newsPosts[1],
                  });
                }}
              >
                <span className="title-bg title-bg-sm">
                  <span className="category">
                    {newsPosts.length !== 0 ? (
                      newsPosts[1].category.map((val, i) => {
                        if (i !== newsPosts[1].category.length - 1)
                          return val + " | ";
                        return val;
                      })
                    ) : (
                      <>
                        <Skeleton width={"50%"} sx={{ bgcolor: "#969696" }} />
                      </>
                    )}
                  </span>
                  <br></br>
                  <span className="title-sm">
                    {newsPosts.length !== 0 ? (
                      newsPosts[1].newsHead
                    ) : (
                      <>
                        <Skeleton sx={{ bgcolor: "#969696" }} />
                        <Skeleton width={"80%"} sx={{ bgcolor: "#969696" }} />
                      </>
                    )}
                  </span>
                </span>

                <img
                  className="w-100 tile-image"
                  src={`${URL}/uploads/${
                    newsPosts.length !== 0 ? newsPosts[1].images[0] : thumb
                  }`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "inline-block";
                  }}
                  height="100%"
                  alt={""}
                ></img>
              </div>

              <div
                className="sub-tile bg-danger mt-2 mt-md-3 hoverZoom pointer"
                style={{
                  backgroundImage: `url(${thumb}`,
                  backgroundPosition: "center",
                  overflow: "hidden",
                }}
                onClick={() => {
                  navigate(`/post/${newsPosts[2]._id}`);
                  dispatch({
                    type: SET_POST_DETAILS,
                    payload: newsPosts[2],
                  });
                }}
              >
                <span className="title-bg title-bg-sm">
                  <span className="category">
                    {newsPosts.length !== 0 ? (
                      newsPosts[2].category.map((val, i) => {
                        if (i !== newsPosts[2].category.length - 1)
                          return val + " | ";
                        return val;
                      })
                    ) : (
                      <>
                        <Skeleton width={"50%"} sx={{ bgcolor: "#969696" }} />
                      </>
                    )}
                  </span>
                  <br></br>
                  <span className="title-sm">
                    {newsPosts.length !== 0 ? (
                      newsPosts[2].newsHead
                    ) : (
                      <>
                        <Skeleton sx={{ bgcolor: "#969696" }} />
                        <Skeleton width={"80%"} sx={{ bgcolor: "#969696" }} />
                      </>
                    )}
                  </span>
                </span>

                <img
                  className="w-100 tile-image"
                  src={`${URL}/uploads/${
                    newsPosts.length !== 0 ? newsPosts[2].images[0] : thumb
                  }`}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "inline-block";
                  }}
                  height="100%"
                  alt={""}
                ></img>
              </div>
            </Col>
            <Col xs={12} lg={2} className="tile ad-tile mt-md-0 mt-2 p-0">
              <span className="sponsor-txt">$ Sponsored</span>
              {ad ? (
                <>
                  <img
                    className="ad-slot-1 pointer"
                    src={`${BACKEND_URL}/uploads/${ad?.imageFrm}`}
                    width="100%"
                    alt=""
                    onClick={() => {
                      handleAdClick(ad?.url);
                    }}
                  />
                  <img
                    className="ad-slot-1-mob pointer d-none"
                    src={`${BACKEND_URL}/uploads/${ad?.imageSqr}`}
                    width="100%"
                    alt=""
                    onClick={() => {
                      handleAdClick(ad?.url);
                    }}
                  />{" "}
                </>
              ) : (
                <>
                  <img
                    className="ad-slot-1 pointer"
                    src={adpic}
                    width="100%"
                    alt=""
                    onClick={() => {
                      handleAdClick(ad?.url);
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
        </Container>
      </Container>

      <Slider data={newsPosts} />
    </>
  );
}
