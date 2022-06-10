import React from "react";
import { Skeleton } from '@mui/material'
import thumb from "../../../Images/gray-thumb.jpg"
import { Col } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants/url";
import { useNavigate } from 'react-router-dom'
function BlackCard({data,lg}) {

  const navigate = useNavigate()
  return (
    <Col md={lg} className="mb-3">
      {data ? (
        <>
          <div
            className="w-100 tech-card pointer"
            style={{
              background: `url(${BACKEND_URL}/uploads/${data?.images[0]})`,
            }}
            onClick={()=>{
              navigate(`/post/${data?._id}`)
            }}
          >
            <span className="tech-title-bg">
              <span className="tech-title">
                {data.newsHead.slice(0, 70)}...
              </span>
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            className="w-100 tech-card pointer"
            style={{
              background: `url(${thumb})`,
            }}
          >
            <span className="tech-title-bg">
              <span className="tech-title">
                <Skeleton height={25} sx={{ bgcolor: "#8c8c8c" }} />
                <Skeleton height={25} sx={{ bgcolor: "#8c8c8c" }} />
                <Skeleton height={25} sx={{ bgcolor: "#8c8c8c" }} width={80} />
              </span>
            </span>
          </div>
        </>
      )}
    </Col>
  );
}

export default BlackCard;
