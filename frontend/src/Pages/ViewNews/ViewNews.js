import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { Container, Row, Col } from "react-bootstrap";
import "./ViewNews.css";
import NewsSection from "./NewsSection/NewsSection";
import Business from "../Homepage/Business/Business";
import LatestCard from "../Homepage/Latest/LatestCard/LatestCard";
import Comments from "./Comments/Comments";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostDetails, getPosts } from "../../actions/postActions";
import { getRelated } from "../../api";
import { clickAd, displayAd } from "../../actions/adActions";
import { BACKEND_URL } from "../../constants/url";
import FooterComp from "../../components/Footer/Footer";
import ScrollContainer from "react-indiana-drag-scroll";
import { CLEAR_POST_DETAILS } from "../../constants/actionTypes";

export default function ViewNews() {
  const {
    selectedPost,
    posts,
    authUser: authData,
  } = useSelector((state) => state);
  const [scroll, setScroll] = useState(0);
  const [related, setRelated] = useState(null);
  const [isNotFound, setNotFound] = useState(false);
  const [ad, setAd] = useState(null);
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPostDetails(postId, setNotFound));
    if (posts.length === 0) {
      dispatch(getPosts());
    }
    document.title = `${
      selectedPost?.details?.newsHead
        ? selectedPost?.details?.newsHead.slice(0, 20)
        : "Post"
    } - Newsonic`;
  }, [authData, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      dispatch({ type: CLEAR_POST_DETAILS });
    };
  }, []);

  useEffect(() => {
    (async function () {
      let { data } = await getRelated(selectedPost.details.category);
      if (data.status) {
        setRelated(data.posts);
      }
    })();
  }, [selectedPost]);

  useEffect(() => {
    let progressBarHandler = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;

      setScroll(scroll);
    };

    window.addEventListener("scroll", progressBarHandler);

    return () => window.removeEventListener("scroll", progressBarHandler);
  });

  useEffect(() => {
    if (selectedPost.details?.isMonetize) {
      (async () => {
        let adParams = {
          format: "FRM2",
          postId: selectedPost?.details?._id,
          channelId: selectedPost?.details?.channelDetails[0]?._id,
        };
        setAd(await displayAd(adParams));
      })();
    }
  }, [selectedPost]);

  useEffect(() => {
    if (isNotFound) {
      navigate("/error");
    }
  }, [isNotFound]);

  const handleAdClick = async (url) => {
    let adParams = {
      format: "FRM2",
      postId: selectedPost?.details?._id,
      adId: ad._id,
      sponsorId: ad.sponsorId,
      channelId: selectedPost?.details?.channelDetails[0]?._id,
    };

    clickAd(adParams);
    window.open(`https://${url}`, "_blank");
  };

  return (
    <>
      <Header next={scroll}></Header>
      <div id="progressBarContainer">
        <div id="progressBar" style={{ transform: `scale(${scroll}, 1)` }} />
      </div>
      <Container className="main-section">
        <Row>
          <Col lg={8}>
            <NewsSection data={selectedPost?.details} />
          </Col>
          <Col lg={4} className="mt-5">
            <Business
              head={"MORE RELATED POSTS"}
              view={true}
              data={related}
              limit={6}
              loadFull={true}
            />

            {selectedPost?.details?.isMonetize && (
              <>
                {ad === null ? (
                  <>Loading.............</>
                ) : (
                  <div
                    className="p-2 mt-5 pointer"
                    onClick={() => {
                      handleAdClick(ad?.url);
                    }}
                  >
                    <span className="sponsor-txt">$ Sponsored</span>
                    <img
                      src={`${BACKEND_URL}/uploads/${ad?.imageFrm}`}
                      width={"100%"}
                      alt=""
                    ></img>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>

        <Row>
          <ScrollContainer className="scroll-container d-flex card-scroll mt-3">
            {posts.slice(0, 7).map((val) => {
              return (
                <span className="me-2">
                  <LatestCard post={val} width="300px" loadFull={true} />
                </span>
              );
            })}
          </ScrollContainer>
        </Row>
      </Container>

      <section className="comment-section py-5">
        <Container style={{ width: "90%" }} className="comment-container">
          <Comments comments={selectedPost.details?.comments} id={postId} />
        </Container>
      </section>

      <FooterComp />
    </>
  );
}
