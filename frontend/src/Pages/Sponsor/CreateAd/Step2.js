import { Card, CardContent, CardHeader, Link, Slider, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import { AiOutlineEye , AiOutlineInfoCircle } from "react-icons/ai";
import { IoMdAlarm } from "react-icons/io";
import { findDiff } from "../../../validations/createAdForm";
import Uploader from "./Uploader";

function Step2({ updateData, ratio, adDetails, fieldErrors, setFieldErrors }) {
  const [value, setValue] = useState([null, null]);
  const [startDate, setStart] = useState(adDetails.startDate);
  const [endDate, setEnd] = useState(adDetails.endDate);
  const [imageFrm, setImageFrm] = useState(adDetails.imageFrm);
  const [imageSqr, setImageSqr] = useState(adDetails.imageSqr);
  const [isCustomType, setCustomType] = useState(false);

  useEffect(() => {
    updateData({
      startDate,
      endDate,
    });
  }, [startDate, endDate]);

  const marks = [
    {
      value: 0.5,
      scaledValue: 500,
      label: "500",
    },
    {
      value: 5,
      scaledValue: 5000,
      label: "5k",
    },
    {
      value: 20,
      scaledValue: 20000,
      label: "20k",
    },
    {
      value: 50,
      scaledValue: 50000,
      label: "50k",
    },
    {
      value: 75,
      scaledValue: 75000,
      label: "75k",
    },
    {
      value: 100,
      scaledValue: 100000,
      label: "100k +",
    },
  ];


  function addImage(img, imgState) {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {
      imgState(reader.result);
    };
  }

  useEffect(() => {
    updateData({
      imageSqr,
      imageFrm,
    });
  }, [imageSqr, imageFrm]);

  const calculateEstm = (views) => {
    let CPI, CPC;
    if (adDetails.format === "FRM1") {
      CPI = 0.05;
      CPC = 1.5;
    } else if (adDetails.format === "FRM2") {
      CPI = 0.04;
      CPC = 2;
    } else if (adDetails.format === "FRM3") {
      CPI = 0.04;
      CPC = 1.5;
    }
    let est = views * CPI + views * 0.01 * CPC;
    updateData({ estAmount: est.toFixed(2) });
  };

  useEffect(() => {
    calculateEstm(adDetails.estView);
  }, [adDetails.estView]);

  const clearFrmError = () => {
    setFieldErrors((prevState)=>({
      ...prevState,
      imageFrm:null
    }))
  }

  const clearSqrError = () => {
    setFieldErrors((prevState)=>({
      ...prevState,
      imageSqr:null
    }))
  }

  return (
    <div className="mt-4">
      <Row>
        <Col md={8} className="col-left mb-3">
          <Card className="step2-card-left">
            <CardContent>
              <TextField
                className="w-100 title-txt"
                id="outlined-basic"
                label="Title"
                variant="outlined"
                value={adDetails?.title}
                onChange={(e) => {
                  updateData({ title: e.target.value });
                  setFieldErrors((prevState) => ({
                    ...prevState,
                    title: null,
                  }));
                }}
                error={fieldErrors?.title}
                helperText={fieldErrors?.title}
              />
              <TextField
                className="w-100 mt-2"
                id="outlined-basic"
                label="URL"
                variant="outlined"
                value={adDetails?.url}
                onChange={(e) => {
                  updateData({ url: e.target.value });
                  setFieldErrors((prevState) => ({
                    ...prevState,
                    url: null,
                  }));
                }}
                error={fieldErrors?.url}
                helperText={fieldErrors?.url}
              />

              <p className="mt-5">Select time period</p>

              <RangeDatePicker
                startDate={startDate}
                endDate={endDate}
                onChange={(startDate, endDate) => {
                  setStart(startDate);
                  setEnd(endDate);
                  setFieldErrors((prevState) => ({
                    ...prevState,
                    date: null,
                  }));
                }}
                minDate={new Date()}
                dateFormat="ddd MMM YYYY"
                monthFormat="ddd MMM YYYY"
                startDatePlaceholder="Start Date"
                endDatePlaceholder="End Date"
                disabled={false}
                className="date-picker"
                startWeekDay="monday"
              />
              <span className="errorText mt-1">{fieldErrors.date}</span>

              <p className="mt-5">
                Targeted number of views&nbsp;&nbsp;
                <span
                  className="pointer"
                  onClick={() => {
                    setCustomType(!isCustomType);
                  }}
                >
                  {!isCustomType ? "Type Custom" : "Show Slider"}
                </span>
              </p>

              {!isCustomType ? (
                <>
                  <Slider
                    className="mt-2"
                    aria-label="Custom marks"
                    defaultValue={adDetails?.estView / 1000}
                    step={1}
                    marks={marks}
                    onChange={(e) => {
                      updateData({
                        estView: e.target.value * 1000,
                      });
                      setFieldErrors((prevState) => ({
                        ...prevState,
                        views: null,
                      }));
                    }}
                  />
                  <span className="errorText mt-1">{fieldErrors.views}</span>
                </>
              ) : (
                <TextField
                  className="w-100 mt-2"
                  id="outlined-basic"
                  label="Estimated View"
                  variant="outlined"
                  type={"number"}
                  value={adDetails?.estView}
                  onChange={(e) => {
                    updateData({
                      estView: e.target.value,
                    });
                    setFieldErrors((prevState) => ({
                      ...prevState,
                      views: null,
                    }));
                  }}
                  error={fieldErrors.views}
                  helperText={fieldErrors?.views}
                />
              )}

              <Row className="mt-3">
                <Uploader
                  ratio={ratio}
                  addImage={addImage}
                  imgState={setImageFrm}
                  cropImage={adDetails.imageFrm}
                  error={fieldErrors?.imageFrm}
                  clearError={clearFrmError}
                />
                <Uploader
                  ratio={[1, 1]}
                  addImage={addImage}
                  imgState={setImageSqr}
                  cropImage={adDetails.imageSqr}
                  error={fieldErrors?.imageSqr}
                  clearError={clearSqrError}
                />
              </Row>
              <Row>
                <Col lg={6}><span className="errorText mt-1">{fieldErrors.imageFrm}</span></Col>
                <Col lg={6}><span className="errorText mt-1">{fieldErrors.imageSqr}</span></Col>
              </Row>
              
            </CardContent>
          </Card>
        </Col>

        <Col md={4} className="step2-right-col">
          <Card className="step2-card-right">
            <div className="content-center p-3 card-left-head"><AiOutlineInfoCircle className="mt-1 me-2"/>Additional Details</div>
            <CardContent>
              <Container>
                <div className="create-ad-titles"><IoMdAlarm /> Duration:</div>
                <div className="cat-days fw-500">{
                  isNaN(findDiff(adDetails.startDate,adDetails.endDate))?
                  "0":
                  findDiff(adDetails.startDate,adDetails.endDate)
                } Days</div>

                <div className="create-ad-titles"><AiOutlineEye /> Estimated Views:</div>
                <div className="cat-days fw-500">{adDetails.estView}</div>

                <div className="create-ad-titles">Estimated amount</div>
                <span className="cat-amount">₹ {adDetails.estAmount}</span>
                <span className="ms-3" style={{color:"gray",fontSize:"12px"}}>(CPC + CPI)</span>
              </Container>
            </CardContent>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Step2;
