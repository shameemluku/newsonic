import React, { useEffect, useState } from "react";
import { 
  Col, 
  Container, 
  Dropdown, 
  Row 
} from "react-bootstrap";
import { BiArrowBack, BiLinkAlt } from "react-icons/bi";
import { IoMdAlarm } from "react-icons/io";
import { MdCropFree } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../constants/url";
import { Button, CircularProgress } from "@mui/material";
import DoDisturbAltIcon from "@mui/icons-material/DoDisturbAlt";
import moment from "moment";
import * as api from "../../../api/admin";

function AdDetails({ adData, setSelectedAd }) {
  const [fullDetails, setFullDetails] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const SHOW = "SHOW_ADMIN_PROGRESS";
  const HIDE = "HIDE_ADMIN_PROGRESS";

  useEffect(() => {
    {
      adData &&
        (async () => {
          try {
            setLoading(true);
            const { data } = await api.getAdRevenueDetails(adData?._id);

            if (data.status) {
              setLoading(false);
              setFullDetails({ ...data?.details });
            } else {
              setLoading(false);
            }
          } catch (err) {
            setLoading(false);
          }
        })();
    }
  }, [adData]);

  const handleEndCampaign = async () => {
    try {
      dispatch({ type: SHOW });
      let { data } = await api.endCampaign(adData?._id);
      dispatch({ type: HIDE });
      if (data) {
        setSelectedAd((prev) => ({
          ...prev,
          isCancelled: true,
          status: "Cancelled",
        }));
      }
    } catch (error) {
      dispatch({ type: HIDE });
    }
  };
  const handleApprove = async () => {
    try {
      dispatch({ type: SHOW });
      let { data } = await api.approveAd(adData?._id);
      dispatch({ type: HIDE });
      if (data) {
        setSelectedAd((prev) => ({
          ...prev,
          isApproved: true,
          status: "Active",
        }));
      }
    } catch (error) {
      dispatch({ type: HIDE });
    }
  };

  return (
    <>
      <div
        className="mt-2 pointer fw-500 f-green"
        onClick={() => setSelectedAd(null)}
      >
        <BiArrowBack className="me-1" />
        Go back
      </div>
      <div className="mt-4">
        <Row>
          <Col lg={3}>
            <div className="ad-analytics-col bg-white">
              ₹{" "}
              {loading ? (
                <>
                  <CircularProgress size={26} style={{ color: "black" }} />
                </>
              ) : (
                <>{fullDetails?.CPI ? fullDetails?.CPI : "0.00"}</>
              )}
              <p className="text-end mb-0 mt-2 f-15">
                CPI <span className="f-12">(Cost Per Impression)</span>
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col bg-white">
              ₹{" "}
              {loading ? (
                <>
                  <CircularProgress size={26} style={{ color: "black" }} />
                </>
              ) : (
                <>{fullDetails?.CPC ? fullDetails?.CPC : "0.00"}</>
              )}
              <p className="text-end mb-0 mt-2 f-15">
                CPC <span className="f-12">(Cost Per Click)</span>
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col bg-white">
              <span style={{ color: "green" }}>
                ₹{" "}
                {fullDetails?.total
                  ? (fullDetails?.total - fullDetails?.paid_amount).toFixed(2)
                  : "0.00"}
              </span>
              <p className="text-end mb-0 mt-2 f-15 ">
                <span className="f-15 me-2" style={{ color: "red" }}>
                  - {fullDetails?.paid_amount}{" "}
                </span>
                Amount to Pay
              </p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="ad-analytics-col ad-analytics-total">
              ₹{" "}
              {loading ? (
                <>
                  <CircularProgress size={26} style={{ color: "white" }} />
                </>
              ) : (
                <>{fullDetails?.total ? fullDetails?.total : "0.00"}</>
              )}
              <p className="text-end mb-0 mt-2 f-15 ">
                Total <span className="f-12">(CPC + CPI)</span>
              </p>
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Row className="mt-1 mb-5">
          <Col>
            <Container className="ad-details-main bg-white">
              <Row className="head">
                <Col>
                  <p className="fw-500">AD ID: {adData?._id}</p>
                </Col>

                {(adData?.status === "Active" ||
                  adData?.status === "Pending") && (
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
                          <div className="end-btn" onClick={handleEndCampaign}>
                            <DoDisturbAltIcon className="me-2" />
                            End Campain
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                )}
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
                  <br />
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
                                    (adData?.status === "Not Started" ||
                                      adData?.status === "Pending") &&
                                    "ad-status-pending"
                                  }
                                  ${
                                    (adData?.status === "Ended" ||
                                      adData?.status === "Cancelled") &&
                                    "ad-status-ended"
                                  }`}
                    >
                      {adData?.status}
                    </span>
                  }

                  {!adData?.isApproved && adData?.status === "Pending" && (
                    <span>
                      <Button className="ms-3" onClick={handleApprove}>
                        APPROVE AD
                      </Button>
                    </span>
                  )}

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
                    {moment(adData?.startDate).format("MMMM d, YYYY")} -{" "}
                    {moment(adData?.endDate).format("MMMM d, YYYY")}
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
    </>
  );
}

export default AdDetails;
