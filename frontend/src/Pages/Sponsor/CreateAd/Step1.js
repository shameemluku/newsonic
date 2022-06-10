import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import form1 from "../../../Images/format1.png";
import form2 from "../../../Images/format2.png";
import form3 from "../../../Images/format3.png";

function Step1({updateData,updateRatio}) {

  return (
    <Container className="step-container">
      <div class="radio-toolbar content-center">

        <Row className="formats-row">
          <div className="info-div">
            <p className="step1-info">
              Get in front of customers when they’re searching for businesses.
              Your ad can appear on our website at the very moment someone start
              browsing
            </p>
          </div>

          <Col lg={4} className="mt-3">
            <input type="radio" id="format1" name="formats" value="razor" />
            <label for="format1" class="w-100 pointer" onClick={()=>{
              updateData({
                format:"FRM1",
                imageFrm: null,
                imageSqr: null
              })
              updateRatio([9,21])
            }}>
                <p className="format-info">Home Banner (9 x 20)</p>
              <div className="format-box content-center">
                <img className="" src={form1} width="80%" alt="" />
              </div>
            </label>
          </Col>

          <Col lg={4} className="mt-3">
            <input type="radio" id="format2" name="formats" value="razor" />
            <label for="format2" class="w-100 pointer" onClick={()=>{
              updateData({
                format:"FRM2",
                imageFrm: null,
                imageSqr: null
              })
              updateRatio([4,5])
            }}>
                <p className="format-info">Horizontal Banner (4 x 5)</p>
              <div className="format-box content-center">
                <img className="" src={form2} width="80%" alt="" />
              </div>
            </label>
          </Col>

          <Col lg={4} className="mt-3">
            <input type="radio" id="format3" name="formats" value="razor" />
            <label for="format3" class="w-100 pointer" onClick={()=>{
                updateData({
                  format:"FRM3",
                  imageFrm: null,
                  imageSqr: null
                })
                updateRatio([20,9])
              }}>
                <p className="format-info">Post Banner (20 x 9)</p>
              <div className="format-box content-center">
                <img className="" src={form3} width="80%" alt="" />
              </div>
            </label>
          </Col>

        </Row>
      </div>
    </Container>
  );
}

export default Step1;
