import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import Uploader from "./Uploader";
import EditIcon from "@mui/icons-material/Edit";
import "./ChannelSettings.css";
import LanguageIcon from "@mui/icons-material/Language";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallIcon from "@mui/icons-material/Call";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { ImPaypal } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { updateChannelData, updateChannelImage } from "../../../actions/channelActions";
import { useSnackbar } from "notistack";
import { BACKEND_URL } from "../../../constants/url";
import doodle from "../../../Images/doodle.jpg";

function ChannelSettings() {
  const { channelDetails, showTopProgress } = useSelector((state) => state);
  const [details, setDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [enabledEdit, setEnableEdit] = useState(false);
  const [edittedData, setEdittedDetails] = useState({
      phone:"",
      email:"",
      website:"",
      paymentAccount:""
  });

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setDetails(channelDetails?.channel);
    setImage(`${BACKEND_URL}/uploads/${channelDetails?.channel?.image}`)
  }, [channelDetails]);

  useEffect(()=>{
    if(enabledEdit){
        setEdittedDetails({
            phone:details?.phone,
            email:details?.email,
            website:details?.website,
            paymentAccount:details?.paymentAccount
        })
    }
  },[enabledEdit])



  const handleUpdate = () =>{
    dispatch(updateChannelData(edittedData,showToast,setEnableEdit))
  }

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
  };

  const addImage = (img) => {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {

        let base64String = reader.result;
        dispatch(updateChannelImage({propic:base64String},showToast,setEnableEdit))

    };
    
  }

  return (
    <>
      <style>{"body {background-color:#F5F7FB;}"}</style>
      <div className="d-flex flex-column">
        <div 
          className="bannerImg" 
          style={{
            backgroundImage:`url(${doodle})`
          }}
        ></div>
        <div className="settings-mainContent mb-5 mt">
          <div className="profile-holder d-flex justify-content-end">
            <Uploader image={image} addImage={addImage} loading={channelDetails?.loading}/>
          </div>

          <>
            <div className="d-flex">
              <span className="settings-channel-name">
                {details !== null && <div>{details.name}</div>}
              </span>
              { !enabledEdit && <EditIcon className="channel-edit-btn ms-3" onClick={
                  ()=>setEnableEdit(true)
              }/> }
            </div>

           { !enabledEdit ?
           <div className="mt-5">
              <p className="fw-500">
                <span className="settings-titles">
                  <PersonOutlineIcon className="f-15 me-2" />
                  UserId :
                </span>{" "}
                {details?.userId}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <CallIcon className="f-15 me-2" />
                  Contact :
                </span>
                {details?.phone}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <MailOutlineIcon className="f-15 me-2" />
                  Email :
                </span>
                {details?.email}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <LanguageIcon className="f-15 me-2" />
                  Website :
                </span>
                {details?.website}
              </p>
              <p className="fw-500">
                <span className="settings-titles">
                  <ImPaypal className="f-15 me-2" />
                  Payment address :
                </span>
                {details?.paymentAccount}
              </p>
            </div>

            :

            <div className="mt-3">
              <TextField
                id="outlined-basic"
                label="Contact number*"
                variant="outlined"
                type="number"
                className="w-100 mt-3"
                value={edittedData.phone}
                onKeyDown={
                    (e)=>{
                        if(e.key === 'e' || e.key === 'E') e.preventDefault()
                    }
                }
                onChange={(e)=>{
                    setEdittedDetails((prev)=>({
                        ...prev,
                        phone:e.target.value
                    }))
                }}
              />

              <TextField
                id="outlined-basic"
                label="Support Email*"
                variant="outlined"
                className="w-100 mt-3"
                value={edittedData.email}
                onChange={(e)=>{
                    setEdittedDetails((prev)=>({
                        ...prev,
                        email:e.target.value
                    }))
                }}
              />

              <TextField
                id="outlined-basic"
                label="Website"
                variant="outlined"
                className="w-100 mt-3"
                value={edittedData.website}
                onChange={(e)=>{
                    setEdittedDetails((prev)=>({
                        ...prev,
                        website:e.target.value
                    }))
                }}
              />

              <TextField
                id="outlined-basic"
                label="Payment address"
                variant="outlined"
                className="w-100 mt-3"
                value={edittedData.paymentAccount}
                onChange={(e)=>{
                    setEdittedDetails((prev)=>({
                        ...prev,
                        paymentAccount:e.target.value
                    }))
                }}
              />

              <Row className="mt-3">
                <Col className="d-flex justify-content-end" md={12}>
                  { !showTopProgress ?
                  <> <Button onClick={()=>setEnableEdit(false)}>Cancel</Button>
                  <Button onClick={handleUpdate}>UPDATE INFO</Button>
                  </>
                  :
                  <>
                  <CircularProgress sx={{color:"green", marginRight:2}} size={25}/> Updating data
                  </>
                  }
                </Col>
              </Row>
            </div> }
          </>
        </div>
      </div>
    </>
  );
}

export default ChannelSettings;
