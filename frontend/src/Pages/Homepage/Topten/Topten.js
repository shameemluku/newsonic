import React, { useEffect, useState } from "react";
import "./Topten.css";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clickAd, displayAd } from "../../../actions/adActions";
import { BACKEND_URL } from "../../../constants/url";
import Skeleton from "@mui/material/Skeleton";
import adpic from '../../../Images/ad2.jpg';

export default function Topten() {
  const { ref: adBanner, inView, entry } = useInView();
  const { authUser, catPosts } = useSelector((state) => state);
  const [ad, setAd] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (inView && ad === null) {
      loadAd();
    }
  }, [inView]);

  const loadAd = () => {
    (async () => {
      let adParams = {
        format: "FRM3",
      };
      setAd(await displayAd(adParams));
    })();
  };

  const handleAdClick = async (url) => {
    let adParams = {
      format: "FRM2",
      adId: ad?._id,
      sponsorId: ad?.sponsorId,
    };

    clickAd(adParams);
    window.open(`https://${url}`, "_blank");
  };


  return (
    <>
      <div className="" style={{ background: "black" }}>
        <Container className="p-3">
          <h3 className="top-title ms-2 mt-2">TOP 10 HEADLINES</h3>

          {catPosts?.top ? (
            <>
              {catPosts?.top.map((post, i, arr) => {
                return (
                  <>
                    <Row className="top-news p-2"
                    onClick={()=>navigate(`/post/${post._id}`)}
                    >
                      <Col xs={2} className="top-ten-index">
                        <div className="top-index text-center">
                          <span className="top-rank">{`#${i + 1}`}</span>
                        </div>
                      </Col>
                      <Col xs={8} className="px-3">
                        <span className="title">
                          {(post?.newsHead).slice(0, 65)}....
                        </span>
                      </Col>
                      <Col xs={2} className="top-ten-img">
                        <div>
                          <img
                            className=""
                            src={`${BACKEND_URL}/uploads/${post?.image}`}
                            width={"100%"}
                            alt=""
                          ></img>
                        </div>
                      </Col>
                    </Row>

                    {i < arr.length - 1 && <div className="top-line"></div>}
                  </>
                );
              })}
            </>
          ) : (
            <>
              {[...Array(10)].map((_, i, arr) => {
                return (
                  <>
                    <Row className="top-news p-2">
                      <Col xs={2}>
                        <div className="top-index text-center">
                          <span className="top-rank">{`#${i + 1}`}</span>
                        </div>
                      </Col>
                      <Col xs={8} className="px-3">
                        <span className="title">
                            <Skeleton sx={{ bgcolor: 'grey.900' }} width={"100%"} variant="text" />
                            <Skeleton sx={{ bgcolor: 'grey.900' }} width={"100%"} variant="text" />
                        </span>
                      </Col>
                      <Col xs={2}>
                        <div>
                        <Skeleton
                            sx={{ bgcolor: 'grey.900' }}
                            variant="rectangular"
                            width={"100%"}
                            height={50}
                        />
                        </div>
                      </Col>
                    </Row>

                    {i < arr.length - 1 && <div className="top-line"></div>}
                  </>
                );
              })}
            </>
          )}
        </Container>
      </div>

      <Container className="p-0 mb-2">
        <Row className="p-0">
          <Col ref={adBanner}>
            { !ad  ?  (
              <div
              className="w-100 mt-3"
              onClick={() => {
                navigate('/sponsor')
              }}
            >
              <span className="sponsor-txt">$ Sponsored</span>
              <img
                className="pointer"
                src={adpic}
                width="100%"
                alt=""
              ></img>
            </div>
            ) : (
              <div
                className="w-100 mt-3"
                onClick={() => {
                  handleAdClick(ad?.url);
                }}
              >
                <span className="sponsor-txt">$ Sponsored</span>
                <img
                  className="pointer"
                  src={`${BACKEND_URL}/uploads/${ad?.imageFrm}`}
                  width="100%"
                  alt=""
                ></img>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
