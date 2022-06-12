import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Header from "../../../components/Header/Header";
import "./CreateAd.css";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { createAd } from "../../../actions/adActions";
import { isAdDetailsValid } from "../../../validations/createAdForm";
import Step4 from "./Step4";

function CreateAd() {
  const [activeStep, setActiveStep] = useState(0);
  const [ratio, setRatio] = useState([]);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState({});

  const [adDetails, setAdDetails] = useState({
    format: null,
    title: null,
    url: null,
    startDate: new Date(),
    endDate: null,
    estView: 500,
    imageFrm: null,
    imageSqr: null,
    estAmount: 500,
  });

  const [fieldErrors,setFieldErrors] = useState({
    title: null,
    url: null,
    startDate: null,
    endDate: null,
    imageFrm: null,
    imageSqr: null,
    views:null
  })

  const dispatch = useDispatch();

  const steps = ["Select ad format", "Create an ad", "Overview"];

  const updateDetails = (details) => {
    setAdDetails({
      ...adDetails,
      ...details,
    });
  };

  const updateRatio = (selectedRatio) => {
    setRatio(selectedRatio);
  };

  const handleNext = () => {
    if (activeStep === 1 && isAdDetailsValid(adDetails,setFieldErrors)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }else if(activeStep === 2){

      dispatch(createAd(adDetails,setProgress,setResponse));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

    } else if(activeStep === 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  

  const handleBack = () => {
    if(activeStep===1){
      setAdDetails({
        ...adDetails,
        format:null
      })
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }else{
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(()=>{
    document.title = `Create Ad - Newsonic`
  },[])


  return (
    <>
      <Header hide={true}/>
      <Container className="pb-5">
        <div className="spons-main-content">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" to="/profile">
              Account
            </Link>
            <Link underline="hover" color="inherit" to="/sponsor">
              Sponsor
            </Link>
            <Link underline="hover" color="inherit" to="/sponsor/dashboard">
              Dashboard
            </Link>
            <Typography color="text.primary">Create ad</Typography>
          </Breadcrumbs>

          <Box sx={{ width: "100%", marginTop: "50px" }}>
            <div className="stepper-div content-center">
              <Stepper activeStep={activeStep} className="stepper-steps w-75">
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>

            {activeStep === steps.length ? (
              <React.Fragment>
                <Step4 updateData={updateDetails} adDetails={adDetails} progress={progress} response={response}/>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Container>
                  {activeStep === 0 && (
                    <Step1
                      updateData={updateDetails}
                      updateRatio={updateRatio}
                      adDetails={adDetails}
                    />
                  )}
                  {activeStep === 1 && (
                    <Step2
                      updateData={updateDetails}
                      ratio={ratio}
                      adDetails={adDetails}
                      fieldErrors={fieldErrors}
                      setFieldErrors={setFieldErrors}
                    />
                  )}

                  {activeStep === 2 && (
                    <Step3 updateData={updateDetails} adDetails={adDetails} />
                  )}

              



                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    {activeStep !== 0 && (
                      <Button
                        className="ad-nav-btn"
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    )}
                    <Box sx={{ flex: "1 1 auto" }} />

                    {adDetails.format !== null && (
                      <Button onClick={handleNext} className="ad-nav-btn">
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    )}
                  </Box>
                </Container>
              </React.Fragment>
            )}
          </Box>
        </div>
      </Container>
    </>
  );
}

export default CreateAd;
