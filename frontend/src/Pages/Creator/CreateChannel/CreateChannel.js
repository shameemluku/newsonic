import React, { useEffect, useState } from "react";
import logo from "../../../Images/mainlogo.svg";
import loadingGif from "../../../Images/loading.gif";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { BiArrowBack, BiError, BiCheckCircle } from "react-icons/bi";
import { Form, Row, Col } from "react-bootstrap";
import Uploader from "./Uploader";
import { Link, useNavigate } from "react-router-dom";
import "./CreateChannel.css";
import { VariantType, useSnackbar } from "notistack";
import { isNameValiable } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { createChannel } from "../../../actions/channelActions";
import { validate } from "../../../validations/createChannel";
import doodle from "../../../Images/doodle.jpg";

export default function CreateChannel() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { authUser: authData, channelCreate } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [proPic, setPropic] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    avail: false,
    notAvail: false,
  });

  const [formData, setFormData] = useState({
    channelName: "",
    phone: authData.user?.phone || "",
    email: authData.user?.email,
    website: "",
    files: null,
  });

  const [errors, setErrors] = useState({
    channelName: "",
    phone: "",
    email: "",
    website: "",
    files: "",
    propic: "",
  });

  function addImage(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {
      let base64String = reader.result;
      setPropic(base64String);
    };
  }

  useEffect(() => {
    if (authData.user?.isCreator) {
      navigate("/creator/");
    }
  }, [authData]);

  async function checkAvailibilty(channel) {
    try {
      setStatus((prevState) => ({
        ...prevState,
        loading: true,
        avail: false,
        notAvail: false,
      }));
      const response = await isNameValiable(channel);
      if (response.data.status) {
        setStatus((prevState) => ({
          ...prevState,
          loading: false,
          avail: true,
          notAvail: false,
        }));
      } else {
        setStatus((prevState) => ({
          ...prevState,
          loading: false,
          avail: false,
          notAvail: true,
        }));
      }
    } catch (error) {
      setStatus((prevState) => ({
        ...prevState,
        loading: false,
        avail: false,
        notAvail: false,
      }));
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  }

  const handleSubmit = () => {
    if (validate(formData, proPic, setErrors) && status.avail) {
      const channelForm = new FormData();

      for (let key in formData) {
        if (key === "files") {
          Array.from(formData[key]).forEach((file) => {
            channelForm.append("file", file, file.name);
          });
        } else {
          channelForm.append(key, formData[key]);
        }
      }

      channelForm.append("propic", proPic);
      dispatch(createChannel(channelForm, setProgress, navigate));
    }
  };

  return (
    <>
      <style>{"body {background-color:#F5F7FB;}"}</style>
      <div className="d-flex flex-column">
        <div className="bannerImg"
        style={{
          backgroundImage:`url(${doodle})`
        }}
        ></div>
        <div className="mainContent mb-5">
          {!channelCreate.loading && (
            <div className="profile-holder d-flex justify-content-end">
              <Uploader
                addImage={addImage}
                isError={errors.propic}
                clearError={() => {
                  setErrors((prev) => ({ ...prev, propic: "" }));
                }}
              />
            </div>
          )}

          {!channelCreate.loading ? (
            <>
              <div>Creator</div>
              <img src={logo} alt="" className="creator-logo"></img>

              <div className="mt-5">
                <TextField
                  id="channel-name-txt"
                  label="Channel name*"
                  variant="outlined"
                  className="channel-name-txt"
                  value={formData.channelName}
                  error={errors?.channelName}
                  helperText={errors.channelName}
                  onChange={(e) => {
                    setStatus((prevState) => ({
                      ...prevState,
                      loading: false,
                      avail: false,
                      notAvail: false,
                    }));
                    setFormData((prevState) => ({
                      ...prevState,
                      channelName: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, channelName: "" }));
                  }}
                  onBlur={(e) => {
                    checkAvailibilty(e.target.value);
                  }}
                />

                {status.loading && (
                  <span className="check-avail">
                    <CircularProgress
                      color="success"
                      className="avail-loader"
                    />
                    Checking availabilty
                  </span>
                )}
                {status.notAvail && (
                  <span className="not-avail">
                    <BiError className="me-1 ms-3" />
                    Not available
                  </span>
                )}
                {status.avail && (
                  <span className="avail">
                    <BiCheckCircle className="me-1 ms-3" />
                    Available
                  </span>
                )}

                <Row>
                  <Col>
                    <TextField
                      id="outlined-basic"
                      label="Contact number*"
                      variant="outlined"
                      className="w-100 mt-3"
                      value={formData.phone}
                      error={errors?.phone}
                      helperText={errors?.phone}
                      onChange={(e) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          phone: e.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                    />
                  </Col>
                  <Col>
                    <TextField
                      id="outlined-basic"
                      label="Support Email*"
                      variant="outlined"
                      className="w-100 mt-3"
                      value={formData.email}
                      error={errors?.email}
                      helperText={errors?.email}
                      onChange={(e) => {
                        setFormData((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }));
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                    />
                  </Col>
                </Row>

                <TextField
                  id="outlined-basic"
                  label="Website"
                  variant="outlined"
                  className="w-100 mt-3"
                  value={formData.website}
                  error={errors?.website}
                  helperText={errors?.website}
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      website: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, website: "" }));
                  }}
                />

                <Form.Group
                  controlId="channel-files"
                  className="mb-3 mt-4 w-100"
                >
                  <Form.Label>Provide a valid proof</Form.Label>
                  <Form.Control
                    type="file"
                    className={`${errors.files && 'error-thin'}`}
                    multiple
                    size="lg"
                    onChange={(e) => {
                      setFormData((prevState) => ({
                        ...prevState,
                        files: e.target.files,
                      }));
                      setErrors((prev) => ({ ...prev, files: "" }));
                    }}
                  />
                  <span className="f-red">{errors?.files}</span>
                </Form.Group>

                <Row>
                  <Col md={12}>
                    <Link to="/" className="noline">
                      <div className="creator-goback-btn mt-3">
                        <BiArrowBack className="me-1" />
                        Go back to home
                      </div>
                    </Link>
                  </Col>
                  <Col className="d-flex justify-content-end" md={12}>
                    <Button
                      variant="contained"
                      className="creator-submit-btn"
                      onClick={handleSubmit}
                    >
                      Submit info
                    </Button>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <div className="loading-section mt-5">
              <div className="content-center">
                <span>
                  <div>Creator</div>
                  <img src={logo} alt="" className="creator-logo"></img>
                </span>
              </div>

              <div className="content-center">
                <img height={"200px"} src={loadingGif} alt=""></img>
              </div>

              <div className="content-center mb-5">
                <span>
                  Please wait... Creating your channel &nbsp; <b>{progress}%</b>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
