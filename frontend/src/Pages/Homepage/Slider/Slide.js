import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants/url";
import Skeleton from "@mui/material/Skeleton";
import thumb from "../../../Images/gray-thumb.jpg"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_POST_DETAILS } from "../../../constants/actionTypes";

export default function Slide({ data }) {

  const [isLoaded, setLoaded] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  return (
    <>
      {data ? (
        <div 
          className="d-flex slider-card pointer"
          onClick={()=>{
            navigate(`/post/${data._id}`)
            dispatch({
              type:SET_POST_DETAILS,
              payload:data
            })
          }}
        >

          {!isLoaded && <img
            src={thumb}
            height="100%"
            width={"302px"}
            alt=""
          ></img>}

          <img
            className={`${!isLoaded?"hide":""}`}
            src={`${BACKEND_URL}/uploads/${data?.images[0]}`}
            height="100%"
            alt=""
            onLoad={()=>setLoaded(true)}
          ></img>


          <div className="slide-body">
            <div className="slide-title">{data?.newsHead}</div>
            <div className="cat mt-2">
              {data?.category.map((val, i) => {
                if (i !== data?.category.length - 1) return val + " | ";
                return val;
              })}
            </div>
          </div>
          <div className="hori-line me-4"></div>
        </div>

      ) : (
        <div className="d-flex slider-card pointer">
          <Skeleton
            variant="rectangular"
            sx={{ bgcolor: "#72b054" }}
            width={300}
            height={"100%"}
          />
          <div className="slide-body">
            <div className="slide-title">
              <Skeleton width={"85%"} height={"30px"} />
              <Skeleton width={"85%"} height={"30px"} />
              <Skeleton width={"75%"} height={"30px"} />
            </div>
            <div className="cat mt-2">
              <Skeleton width={"40%"} height={"20px"} />
            </div>
          </div>
          <div className="hori-line me-4"></div>
        </div>
      )}
    </>
  );
}
