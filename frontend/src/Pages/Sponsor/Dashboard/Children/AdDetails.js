import { Button, CircularProgress, Fab } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { BiLinkAlt } from "react-icons/bi";
import { IoMdAlarm } from "react-icons/io";
import { MdCropFree } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { getAdRevenueDetails } from "../../../../api";
import { BACKEND_URL } from "../../../../constants/url";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { endCampaign } from "../../../../actions/adActions";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

function AdDetails({ data: selectedAd, setCurrent }) {
  const [fullDetails, setFullDetails] = useState({});
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false)
  const [adData,setAdData] = useState(selectedAd)
  const dispatch = useDispatch();

  useEffect(() => {
    {
      adData &&
        (async () => {
          try {
            dispatch({type:"SHOW_PROGRESS"})
            setLoading(true)
            const { data } = await getAdRevenueDetails(adData?._id);
            dispatch({type:"HIDE_PROGRESS"})
            if (data.status) {
              setLoading(false)
              setFullDetails({ ...data?.details });
            }else {
              setLoading(false)
            }
          } catch (err) {
            setLoading(false)

          }
        })();
    }
  }, [adData]);


  const handleEndCampaign = () =>{
    dispatch(endCampaign(adData?._id,setAdData))
  }

  return (
    <>
      <div className="mt-5">
        <Row>
          <Col lg={3}>
            <div className="ad-analytics-col">
              ₹ {
                loading ? 
                <><CircularProgress size={26} style={{color:"black"}}/></>
                :
                <>{fullDetails?.CPI ? fullDetails?.CPI : "0.00"}</>
              } 
              <p className="text-end mb-0 mt-2 f-15">
                CPI <span className="f-12">(Cost Per Impression)</span>
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col">
              ₹ {
                loading ? 
                <><CircularProgress size={26} style={{color:"black"}}/></>
                :
                <>{fullDetails?.CPC ? fullDetails?.CPC : "0.00"}</>
              } 

              <p className="text-end mb-0 mt-2 f-15">
                CPC <span className="f-12">(Cost Per Click)</span>
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col">
              <span style={{color:"green"}}>₹ {fullDetails?.total ? (fullDetails?.total - fullDetails?.paid_amount).toFixed(2) : "0.00"}</span>
              <p className="text-end mb-0 mt-2 f-15 ">
              <span className="f-15 me-2" style={{color:"red"}}>- {fullDetails?.paid_amount} </span>Amount to Pay
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col ad-analytics-total">
              ₹ {
                loading ? 
                <><CircularProgress size={26} style={{color:"white"}}/></>
                :
                <>{fullDetails?.total ? fullDetails?.total : "0.00"}</>
              } 
              <p className="text-end mb-0 mt-2 f-15 ">
                Total <span className="f-12">(CPC + CPI)</span>
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Row className="mt-3 mb-5">
          <Col>
            <Container className="ad-details-main">
              <Row className="head">
                

                <Col>
                <p className="fw-500">AD ID: {adData?._id}</p>
                </Col>



                { !adData?.isCancelled &&
                  <Col className="content-end">
                  <Dropdown className="d-inline mx-2">
                    <Dropdown.Toggle
                      id="dropdown-autoclose-true"
                      className="dropBtn dropBtn-ads"
                    >
                      Actions
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropmenu-ad">
                      <Dropdown.Item href="#">
                          <div className="end-btn" onClick={handleEndCampaign}><DoDisturbAltIcon className="me-2"/>End Campain</div>
                      </Dropdown.Item>
                    
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                }


              </Row>
              <Row>
                <Col className="details-left-content" lg={6}>
                  <p className="titles">Title:</p>
                  <p>{adData?.title}</p>

                  <p className="titles">
                    <BiLinkAlt /> Url:
                  </p>
                  <p>{adData?.url}</p>

                  <span className="titles me-2">
                    <MdCropFree /> Format:
                  </span>
                  <span>{adData?.format}</span>
                  <br/>
                  <span className="titles me-2">
                    <RiMoneyDollarCircleLine /> Budget:
                  </span>
                  <span>₹ {adData?.estAmount}</span>


                </Col>
                <Col className="details-right-content" lg={6}>
                  <span className="titles me-2">Status:</span>
                  {
                    <span
                      className={`sponsor-status-span 
                                  ${
                                    adData?.status === "Active" &&
                                    "ad-status-active"
                                  }
                                  ${
                                   (adData?.status === "Not Started" || adData?.status === "Pending Approval")  &&
                                    "ad-status-pending"
                                  }
                                  ${
                                    (adData?.status === "Ended" || adData?.status === "Cancelled") &&
                                    "ad-status-ended"
                                  }`}
                                  
                    >
                      {adData?.status}
                    </span>
                  }

                  <br />
                  <br />

                  <span className="titles me-2">Est. Views:</span>
                  <span>{adData?.estView}</span>
                  <br />

                  <span className="titles me-2">Total Views:</span>
                  <span>{adData?.viewsCount}</span>
                  <br></br>

                  <span className="titles me-2">Clicks:</span>
                  <span>{adData?.clickCount}</span>

                  <p className="titles mt-3">
                    <IoMdAlarm /> Duration:
                  </p>
                  <p>
                    {moment(adData?.startDate).format('MMMM Do, YYYY')} -{" "}
                    {moment(adData?.endDate).format('MMMM Do, YYYY')}
                  </p>
                </Col>
              </Row>
              <Row className="banner-row">
                <p className="titles mt-3">
                  <BiLinkAlt /> Banners:
                </p>

                <p></p>

                <Col lg={6} className="mb-3">
                  <img
                    className="banner-thumbnail"
                    src={`${BACKEND_URL}/uploads/${adData.imageFrm}`}
                    alt=""
                  />
                </Col>

                <Col lg={6} className="mb-3">
                  <img
                    className="banner-thumbnail"
                    src={`${BACKEND_URL}/uploads/${adData.imageSqr}`}
                    alt=""
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </div>

      <Button
        className="fab"
        aria-label="add"
        onClick={() => {
          setCurrent("ADLIST");
        }}
      >
        <ArrowBackIcon /> Go back
      </Button>
    </>
  );
}

export default AdDetails;
