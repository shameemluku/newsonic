import { Avatar, CircularProgress, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import "./Dashboard.css";
import { getDashboard } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../../constants/url";
import { BiLike } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";


export default function Dashboard() {

  let loading = false;
  const [dashData,setDashData] = useState({})
  const {channelDetails, showTopProgress} = useSelector((state)=>state)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(()=>{
    (async()=>{

        try {
          dispatch({type:"SHOW_PROGRESS"})
          let {data} = await getDashboard(channelDetails.channel._id)
          dispatch({type:"HIDE_PROGRESS"})
          setDashData({...data})
        } catch (error) {
          dispatch({type:"HIDE_PROGRESS"})
        }
      }
    )()
  },[])

  useEffect(()=>{
    console.log(dashData);
  },[dashData])

  return (
    <>
      <Container>
        <div className="mt-5">
          <Container>
          <Row>
            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <FeaturedPlayListIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Posts</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.total_posts  }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total no. of Posts</span>
                </p>
              </div>
            </Col>
            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <RemoveRedEyeIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Views</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.view_count }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total no. of views</span>
                </p>
              </div>
            </Col>
            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <ThumbUpIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Likes</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ !showTopProgress ? dashData?.likes_count : "Loading"}</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total no. of Likes</span>
                </p>
              </div>
            </Col>

            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <MonetizationOnIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Monetize</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.monetized_posts }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Monetized Posts</span>
                </p>
              </div>
            </Col>

            
            <Col lg={2} className={"p-1"}>
              <div 
                className="ad-analytics-col  creator-analytics-withdrawable fixed-height pointer"
                onClick={()=>{
                  navigate('/creator/transactions')
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={26} style={{ color: "green" }} />
                  </>
                ) : (
                  <span className="f-green">₹ {dashData?.total_earning ? (dashData?.withdrawable).toFixed(2) : "0.00"}</span>
                )}
                <p className="total-desc f-15 f-green">
                  Withdrawable
                </p>
              </div>
            </Col>

            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col  ad-analytics-total fixed-height">
                ₹{" "}
                {loading ? (
                  <>
                    <CircularProgress size={26} style={{ color: "white" }} />
                  </>
                ) : (
                  <>{dashData?.total_earning ? (dashData?.total_earning).toFixed(2) : "0.00"}</>
                )}
                <p className="total-desc f-15 ">
                  Total <span className="f-12">(CPC + CPI)</span>
                </p>
              </div>
            </Col>

            
          </Row>
          </Container>
        </div>

        <div>
          <Row>
          <Col lg={6}>
              <div className="creator-dash-card">
                  <p className="dash-card-heading"><AiOutlineEye className="me-2"/>Most Viewed</p>
              { dashData?.most_viewed ?
                dashData?.most_viewed.map((val,i,arr)=>{

                  return (
                  <div className="d-flex w-100 my-2">
                    <div className="w-20">
                      <img src={`${BACKEND_URL}/uploads/${val.image}`} width="80%" alt=""/>
                    </div>
                    <p className={`w-60 titletest ${i<arr.length-1 && "title-line"}`}>
                      <Link className="post-head-link" to={`/creator/post/${val._id}`}>{val.newsHead.slice(0,70)}...</Link>
                    </p>
                    <p className="w-20 content-end">{val.views}<AiOutlineEye className="ms-2 mt-1"/></p>
                  </div> )
                  
                })

                :
                <>
                {
                  [...Array(6)].map((_,i,arr)=>{

                    return (
                    <div className="d-flex w-100 my-2">
                      <div className="w-20">
                      <Skeleton
                        variant="rectangular"
                        width={"80%"}
                        height={50}
                      />
                      </div>
                      <p className={`w-60 titletest mb-0 ${i<arr.length-1 && "title-line"}`}>
                        <Skeleton /><Skeleton />
                      </p>
                      <p className="w-20 content-end"><Skeleton width={"40%"} /></p>
                    </div> )
                    
                  })
  
                }
                </>
              }
              </div>
              
            </Col>
            
            <Col lg={6}>
              <div className="creator-dash-card">
                  <p className="dash-card-heading"><BiLike className="me-2"/>Most Liked</p>
              { dashData?.most_liked ? 
                dashData?.most_liked.map((val,i,arr)=>{

                  return (
                  <div className="d-flex w-100">
                    <div className="w-20">
                      <img src={`${BACKEND_URL}/uploads/${val.image}`} width="80%" alt=""/>
                    </div>
                    <p className={`w-60 titletest ${i<arr.length-1 && "title-line"}`}>
                      <Link className="post-head-link" to={`/creator/post/${val._id}`}>{val.newsHead.slice(0,70)}...</Link>
                    </p>
                    <p className="w-20 content-end">{val.likes}<BiLike className="ms-2 mt-1"/></p>
                  </div> )
                  
                })
                :
                <>
                {
                  [...Array(6)].map((_,i,arr)=>{

                    return (
                    <div className="d-flex w-100 my-2">
                      <div className="w-20">
                      <Skeleton
                        variant="rectangular"
                        width={"80%"}
                        height={50}
                      />
                      </div>
                      <p className={`w-60 titletest mb-0 ${i<arr.length-1 && "title-line"}`}>
                        <Skeleton /><Skeleton />
                      </p>
                      <p className="w-20 content-end"><Skeleton width={"40%"} /></p>
                    </div> )
                    
                  })
  
                }
                </>
              }
              </div>
              
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}
