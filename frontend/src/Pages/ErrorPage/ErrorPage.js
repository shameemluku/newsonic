import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPosts } from "../../actions/postActions";
import { fetchPosts } from "../../api";
import Header from "../../components/Header/Header";
import LatestCard from "../Homepage/Latest/LatestCard/LatestCard";
import BlackCard from "../Homepage/Technology/BlackCard";
import Technology from "../Homepage/Technology/Technology";
import errorGif from "../../Images/404.gif"

function ErrorPage() {
  
  const { posts } = useSelector((state) => state);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Newsonic"
    posts.length === 0 && dispatch(getPosts());
  }, []);



  return (
    <>
      <Header />

      <div className="category-content">
          <>
            <Container>
              <div className="content-center cat-error">
                <div>
                <p className="text-center cat-error-head">PAGE NOT FOUND</p>
                <p className="text-center mb-0"><img className="cat-error-gif" src={errorGif} alt="" draggable={false}/></p>
                <p className="text-center error-404-desc">We're sorry, we seem to have lost this page, but we don't want to lose you.</p>
                </div>
              </div>
              <span className="cat-continue-head">Continue Reading...</span>
              <div className="d-flex card-scroll mt-3">
                {posts.slice(0, 7).map((val) => {
                  return (
                    <span className="me-2">
                      <LatestCard post={val} width="300px" loadFull={true} />
                    </span>
                  );
                })}
              </div>
            </Container>
          </>

      </div>
    </>
  );
}

export default ErrorPage;
