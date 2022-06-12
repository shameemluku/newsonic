import React, { useEffect, useState } from "react";
import * as api from "../../../api/admin";
import { Avatar, Button, CircularProgress, Skeleton } from "@mui/material";
import { Col, Container, Row } from "react-bootstrap";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import { ImPaypal } from "react-icons/im";
import { getDashboard } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../../constants/url";
import { BiLike } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RiPaypalLine } from "react-icons/ri";


export default function AdminDashboard() {

  let loading = false;
  const [dashData,setDashData] = useState({})
  const {showTopProgress} = useSelector((state)=>state)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(()=>{
    (async()=>{

        try {
          dispatch({type:"SHOW_PROGRESS"})
          let {data} = await api.getDashboard()
          dispatch({type:"HIDE_PROGRESS"})
          setDashData({...data})
        } catch (error) {
          dispatch({type:"HIDE_PROGRESS"})
        }
      }
    )()
  },[])


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
                    <p className="number-card mb-0">{ dashData?.postCount  }</p>
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
                    <PersonIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Users</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.userCount }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total no. of Users</span>
                </p>
              </div>
            </Col>
            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <AssignmentIndIcon/>
                  </Avatar>
                  <p className="creator-dash-card-title">Channels</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ !showTopProgress ? dashData?.channelCount : "Loading"}</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total no. of Channels</span>
                </p>
              </div>
            </Col>

            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <MonetizationOnIcon />
                  </Avatar>
                  <p className="creator-dash-card-title">Ads</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.adCount }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Total Ads</span>
                </p>
              </div>
            </Col>

            <Col lg={2} className={"p-1"}>
              <div className="ad-analytics-col dash-count-card bg-white">
                <div className="d-flex">
                  <Avatar className="me-3">
                    <RiPaypalLine />
                  </Avatar>
                  <p className="creator-dash-card-title">Payout</p>
                </div>
                <p className="content-end me-3 mb-0">
                  {showTopProgress ? (
                    <>
                      <CircularProgress size={28} style={{ color: "black" }} />
                    </>
                  ) : (
                    <p className="number-card mb-0">{ dashData?.payoutCount }</p>
                  )}
                </p>
                <p className="text-end mb-0 mt-2 f-15">
                  <span className="f-15 me-3">Payout Requests</span>
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
                  <>{dashData?.totalEarnings ? (dashData?.totalEarnings).toFixed(2) : "0.00"}</>
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
                  <p className="dash-card-heading"><RiPaypalLine className="me-2"/>Payout Requests</p>
              { dashData?.payout_requests ?
                dashData?.payout_requests.map((val,i,arr)=>{

                  return (
                  <div className="d-flex w-100 my-2">
                    <p className={`w-80 titletest ${i<arr.length-1 && "title-line"}`}>
                    <ImPaypal className="me-3"/>{val?.paypalId.slice(0,70)}...
                    </p>
                    <p className={`w-20 content-end ${i<arr.length-1 && "title-line"} `}>₹ {val?.amount}</p>
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
                  <p className="dash-card-heading"><MonetizationOnIcon className="me-2"/>Ad Requests</p>
              { dashData?.ad_requests ? 
                dashData?.ad_requests.map((val,i,arr)=>{

                  return (
                  <div className="d-flex w-100">
                    <div className="w-10">
                      <img src={`${BACKEND_URL}/uploads/${val?.imageSqr}`}  height={"50px"} alt=""/>
                    </div>
                    <p className={`w-50 ms-3 titletest ${i<arr.length-1 && "title-line"}`}>
                      <Link className="post-head-link" to={`/creator/post/${val._id}`}>{val?.title.slice(0,70)}...</Link>
                    </p>
                    <p className={`w-20 content-end ${i<arr.length-1 && "title-line"} `}>₹ {val?.estAmount}</p>
                    <p className="w-20 content-end"><Button onClick={()=>navigate('/admin/ads')}>Details</Button></p>
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
