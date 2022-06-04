import React from 'react'
import { Col, Container, Dropdown, Row } from 'react-bootstrap'
import { BiLinkAlt } from "react-icons/bi";
import { IoMdAlarm } from "react-icons/io";
import { MdCropFree } from "react-icons/md";
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { BACKEND_URL } from '../../../constants/url';

function Step3({adDetails}) {

  const {authUser:authData} = useSelector((state)=>state)
  return (
    <>
    <Container>
    <div>
        <Row className="mt-3 mb-5">
          <Col>
            <Container className="ad-details-main">
              <Row className="head">
                

                <Col>
                <p className="fw-500">Overview</p>
                </Col>



                <Col className="content-end">
                <p className="fw-500">Sponsor ID: {authData.user._id}</p>
                </Col>


              </Row>
              <Row>
                <Col className="details-left-content" lg={6}>
                  <p className="titles">Title:</p>
                  <p>{adDetails.title}</p>

                  <p className="titles">
                    <BiLinkAlt /> Url:
                  </p>
                  <p>{adDetails.url}</p>

                  <span className="titles me-2">
                    <MdCropFree /> Format:
                  </span>
                  <span>{adDetails.format}</span>
                </Col>
                <Col className="details-right-content" lg={6}>
                
                  <span className="titles me-2">Estimated Amount:</span>
                  <span>₹ {adDetails.estAmount}</span>

                  <br />
                  <br />

                  <span className="titles me-2">Est. Views:</span>
                  <span>{adDetails.estView}</span>
                  <br />



                  <p className="titles mt-3">
                    <IoMdAlarm /> Duration:
                  </p>
                  <p>
                    {moment(adDetails.startDate).format('MMMM d, YYYY') +" "} - 
                    {moment(adDetails.endDate).format('MMMM d, YYYY') +" "}
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
                    src={adDetails.imageFrm}
                    alt=""
                  />
                </Col>

                <Col lg={6} className="mb-3">
                  <img
                    className="banner-thumbnail"
                    src={adDetails.imageSqr}
                    alt=""
                  />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </div>
      </Container>
    </>
  )
}

export default Step3