import { Skeleton } from "@mui/material";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPostDetails } from "../../../actions/postActions";
import { SET_POST_DETAILS } from "../../../constants/actionTypes";
import { BACKEND_URL } from "../../../constants/url";
import "./Business.css";

export default function Business({ data, head, view, limit, loadFull }) {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Container className="p-0 mt-3">
      <span className={`cat-head ${view && "ms-4"}`}>{head}</span>

      {data ? (
        <>
          {data.slice(0, limit).map((val, i, arr) => {
            return (
              <Container className="business-card"
              onClick={()=>{
                navigate(`/post/${val._id}`)
                if(loadFull){
                  window.scrollTo(0, 0)
                  dispatch(getPostDetails(val._id))
                }
                dispatch({
                  type:SET_POST_DETAILS,
                  payload:val
                })
              }}
              >
                <Row className="mb-2 p-2 mr-3">
                  <Col xs={9} className="business-title p-0">
                    <h4>{val.newsHead.substr(0, 60)}...</h4>
                  </Col>
                  <Col xs={3} className="p-0">
                    <img
                      className="business-image"
                      src={`${BACKEND_URL}/uploads/${val.images[0]}`}
                      alt=""
                    ></img>
                  </Col>
                </Row>
                {i !== arr.length - 1 && <div className="business-line"></div>}
              </Container>
            );
          })}
        </>
      ) : (
        <>
          {[...Array(5)].map((_, i, arr) => {
            return (
              <Container className="business-card">
                <Row className="mb-2 p-2 mr-3">
                  <Col xs={9} className="business-title p-0">
                    <h4>
                      <Skeleton height={25} />
                      <Skeleton height={25} />
                    </h4>
                  </Col>
                  <Col xs={3} className="p-0">
                    <Skeleton
                      variant="rectangular"
                      height={50}
                      width={"100%"}
                    />
                  </Col>
                </Row>
                {i !== arr.length - 1 && <div className="business-line"></div>}
              </Container>
            );
          })}
        </>
      )}
    </Container>
  );
}
