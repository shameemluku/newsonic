import React, { useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { BiLinkAlt } from "react-icons/bi";
import { MdCropFree } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { IoMdAlarm } from "react-icons/io";
import moment from "moment";
import { Col, Container, Row } from "react-bootstrap";
import { BACKEND_URL } from "../../../../constants/url";
import loadingAnim from "../../../../Images/loading.gif";
import { useSelector } from "react-redux";

function AdList({ adsList, handleDetails }) {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [ads, setAds] = useState([]);
  const {sponsorDetails} = useSelector((state)=>state)

  const handleChange = (event, newStatus) => {
    if (adsList) {
      if (newStatus === "ALL") {
        setAds([...adsList]);
      } else if (newStatus === "ACTIVE") {
        setAds([
          ...adsList.filter((val) => {
            if (val.status === "Active") return val;
          }),
        ]);
      } else if (newStatus === "PENDING") {
        setAds([
          ...adsList.filter((val) => {
            if (
              val.status === "Pending Approval" ||
              val.status === "Not Started"
            )
              return val;
          }),
        ]);
      } else if (newStatus === "ENDED") {
        setAds([
          ...adsList.filter((val) => {
            if (val.status === "Ended" || val.status === "Cancelled") return val;
          }),
        ]);
      }

      setFilterStatus(newStatus);
    }
  };

  useEffect(() => {
    setAds([...adsList]);
  }, [adsList]);



  return (
    <>
      <div className="ad-toggle-status mt-5">
        <ToggleButtonGroup
          style={{ backgroundColor: "white" }}
          value={filterStatus}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton value="ALL" className="show-post-toogle">
            ALL
          </ToggleButton>
          <ToggleButton value="ACTIVE" className="show-post-toogle">
            ACTIVE
          </ToggleButton>
          <ToggleButton value="PENDING" className="show-post-toogle">
            PENDING
          </ToggleButton>
          <ToggleButton value="ENDED" className="show-post-toogle">
            ENDED
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="dashboard-ad-cards">
        <div className="w-100 mt-3">
          <Row>
            {!sponsorDetails.loading ? (
              <>
                {ads.length !== 0 ? (
                  <>
                    {ads.map((val) => {
                      return (
                        <Col lg={12} className="mb-3">
                          <Card className="ad-cards" sx={{ minWidth: 275 }}>
                            <CardContent className="ad-cards-content">
                              <Row>
                                <Col lg={3}>
                                  <img
                                    className="home-ad-thumbail"
                                    src={`${BACKEND_URL}/uploads/${val?.imageFrm}`}
                                    width="90%"
                                    height={"150px"}
                                  />
                                </Col>
                                <Col lg={5}>
                                  <p className="titles">Title:</p>
                                  <p>{val?.title}</p>

                                  <p className="titles">
                                    <BiLinkAlt /> Url:
                                  </p>
                                  <p>{val?.url}</p>

                                  <p className="titles">
                                    <MdCropFree /> Format: {val?.format}
                                  </p>
                                </Col>
                                <Col lg={4}>
                                  {
                                    <span
                                      className={`sponsor-status-span 
                                  ${
                                    val?.status === "Active" &&
                                    "ad-status-active"
                                  }
                                  ${
                                    val?.status === "Not Started" &&
                                    "ad-status-pending"
                                  }
                                  ${
                                    val?.status === "Pending Approval" &&
                                    "ad-status-pending"
                                  }
                                  ${
                                    (val?.status === "Ended" || val?.status === "Cancelled") && "ad-status-ended"
                                  }`}
                                    >
                                      Status:&nbsp;&nbsp;
                                      {val?.status}
                                    </span>
                                  }

                                  <p className="titles mt-3">
                                    <IoMdAlarm /> Duration
                                  </p>
                                  <p>
                                    {moment(val?.startDate).format(
                                      "MMMM d, YYYY"
                                    )}{" "}
                                    -{" "}
                                    {moment(val?.endDate).format(
                                      "MMMM d, YYYY"
                                    )}
                                  </p>
                                  <p>
                                    <AiOutlineEye /> Views : {val?.viewsCount}
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="content-end">
                                  <Button
                                    className="ad-details-btn"
                                    onClick={() => {
                                      handleDetails(val);
                                    }}
                                  >
                                    Details
                                  </Button>
                                </Col>
                              </Row>
                            </CardContent>
                          </Card>
                        </Col>
                      );
                    })}
                  </>
                ) : (
                  <>Nothing</>
                )}
              </>
            ) : (
              <>
            
            <Col lg={12} className="mb-3">
                          <Card className="ad-cards" sx={{ minWidth: 275 }}>
                            <CardContent className="ad-cards-content">
                              <Row>
                                <Col lg={3}>
                                <Skeleton variant="rectangular" width={"100%"} height={"150px"} />
                                </Col>
                                <Col lg={5}>
                                  <p className="titles">Title:</p>
                                  <p><Skeleton width={"80%"} /></p>

                                  <p className="titles">
                                    <BiLinkAlt /> Url:
                                  </p>
                                  <p><Skeleton width={"80%"} /></p>

                                  <p className="titles">
                                    <MdCropFree /> Format: <Skeleton width={"30%"} />
                                  </p>
                                </Col>
                                <Col lg={4}>
                             
                                    <span
                                      className=""
                                    >
                                      Status:
                                    </span>
                          

                                  <p className="titles mt-3">
                                    <IoMdAlarm /> Duration
                                  </p>
                                  <p><Skeleton width={"80%"} /></p>
                                  <p>
                                    <AiOutlineEye /> Views : <Skeleton width={"40%"} />
                                  </p>
                                </Col>
                              </Row>
                              <Row>
                                <Col className="content-end">
                                  <Button
                                  
                                  >
                                  </Button>
                                </Col>
                              </Row>
                            </CardContent>
                          </Card>
                        </Col>
              </>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}

export default AdList;
