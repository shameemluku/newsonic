import React, { useEffect } from "react";
import Autocomplete from "./Autocomplete";
import { Row, Col, Container, Card, ProgressBar, Alert } from "react-bootstrap";
import { useState } from "react";
import { IoCloseSharp, IoSaveOutline } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiCommentX } from "react-icons/bi";
import { VscGlobe } from "react-icons/vsc";
import Switch from "../../../components/Elements/Switch";
import "./Addnews.css";
import Button from "@mui/material/Button";
import Uploader from "../../../components/Admin/ImageUpload/Uploader";
import { style } from "@mui/system";

import { useDispatch,useSelector } from "react-redux";
import { createPost, saveDraft } from "../../../actions/postActions";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../../actions/userActions";
import { getCategory } from "../../../api";
import { useSnackbar } from "notistack";
import { CLEAR_SELECTED_DRAFT } from "../../../constants/actionTypes";

export default function Addnews() {

  const maxLength = 5000;
  const [category, setCat] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newsText, setNewsText] = useState({ newsHead: "", newsBody: "" });
  const [monetize, setMonetize] = useState(false);
  const [comment, setComment] = useState(false);
  const [remainig, setRemain] = useState(maxLength);
  const [draftId, setDraftId] = useState(null);

  const [images, setImages] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [headError, setHeadError] = useState(false);
  const [catError, setCatError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [progress, setProgress] = useState();

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const authData = useSelector((state) => state.authUser);
  const channelDetails = useSelector((state) => state.channelDetails);
  const draft = useSelector((state) => state.selectedDraft);
  const { enqueueSnackbar } = useSnackbar();

  useEffect( () => {
    fetchCategory()
    if(draft){
      draft?.category && setCat([...draft?.category])
      draft?.monetize && setMonetize(draft?.monetize)
      draft?.comment && setComment(draft?.comment)
      setNewsText({
        newsHead:draft?.newsHead,
        newsBody:draft?.newsBody
      })
      setDraftId(draft?._id)
    }
    return () => {
      dispatch({type:CLEAR_SELECTED_DRAFT})
    }
  },[]);


  const fetchCategory = async () => {
    let {data} = await getCategory()
    setCategories([
      ...data.categories.map((val)=>{
        return val.name;
      })
    ])
    
  }



  function changeCat(cat) {
    let f = 0;
    category.map((val) => {
      if (val === cat) {
        f = 1;
      }
    });

    if (f !== 1) {
      setCat([...category, cat]);
    }
  }

  function deleteCat(index) {
    let newCat = category.filter((val, i) => {
      if (index !== i) {
        return val;
      }
    });

    setCat(newCat);
  }


  function addImage(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {
      let base64String = reader.result;
      setImages([...images, base64String]);
    };
  }

  function removeImage(index) {
    let deletedArray = images.filter((img, ind) => {
      if (index != ind) {
        return img;
      }
    });

    setImages(deletedArray);
  }

  function handleSave(e) {
    e.preventDefault();

    let isValid = true;

    if (isErrorHead()) isValid = false;
    if (isErrorBody()) isValid = false;
    if (isErrorCat()) isValid = false;
    if (isErrorImg()) isValid = false;

    if (!isValid) return;
    let {_id:channelId} = channelDetails.channel
    
    let data = {
      ...newsText,
      category,
      comment,
      monetize,
      images,
      channelId,
      draftId:draftId
    };

    dispatch(createPost(data, setProgress, progress));
  }

  const handleDraft = async () => {

    const {newsHead,newsBody} = newsText
    const {_id:channelId} = channelDetails.channel

    if(newsHead.length>30 || newsBody.length>30){
      let data = {
        ...newsText,
        category,
        comment,
        monetize,
        channelId,
        draftId:draftId
      }
      dispatch({type:'SHOW_PROGRESS'})
      if(await saveDraft(data)) enqueueSnackbar('Saved to draft', { variant: 'success' });
      else enqueueSnackbar('Operation Failed', { variant: 'error' });
      dispatch({type:'HIDE_PROGRESS'})
    }else{
      enqueueSnackbar('Atleast 30 characters to create draft', { variant: 'info' })
    }
  }

  useEffect(()=>{
    if(progress===100){
      navigate('/creator/posts')
    }
  },[progress])

  function isErrorHead() {
    const {newsHead,newsBody} = newsText
    if (newsHead.length < 30 || newsHead[0] === " ") {
      setTitleError(true);
      enqueueSnackbar('Heading cannot be empty or atleast 30 characters', { variant: 'info' })
      return true;
    }
    return false;
  }

  function isErrorBody() {
    const {newsHead,newsBody} = newsText
    if (newsBody.length< 30 || newsBody[0] === " ") {
      setHeadError(true);
      enqueueSnackbar('Body cannot be empty or atleast 30 characters', { variant: 'info' })
      return true;
    }
    return false;
  }

  function isErrorCat() {
    if (category.length === 0) {
      setCatError(true);
      return true;
    }
    return false;
  }

  function isErrorImg() {
    if (images.length === 0) {
      setImgError(true);
      return true;
    }
    return false;
  }


  return (
    <>
      <Container>
        <Row>
          <Col sm={9}>
            <Card className="mb-3">
              <Card.Body className="ms-0">
                <input
                  type={"text"}
                  className={
                    titleError ? "add-input w-100 error" : "add-input w-100"
                  }
                  placeholder="News heading here..."
                  onChange={(e) => {
                    setTitleError(false);
                    setNewsText({ ...newsText, newsHead: e.target.value });
                  }}
                  value={newsText.newsHead}
                ></input>
                <textarea
                  type={"text"}
                  className={
                    headError ? "add-text w-100 error" : "add-text w-100"
                  }
                  placeholder="Type news details here..."
                  maxLength={maxLength}
                  value={newsText.newsBody}
                  onKeyUp={(e) => {
                    if (remainig >= 0) {
                      setRemain(maxLength - e.target.value.length);
                    }
                  }}
                  onChange={(e) => {
                    setHeadError(false);
                    setNewsText({ ...newsText, newsBody: e.target.value });
                  }}
                ></textarea>
                <div
                  style={{
                    color: "grey",
                    fontSize: "14px",
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  Remaining characters : {remainig}
                </div>

                <div className="selected-container d-flex">
                  {images.map((img, i) => {
                    return (
                      <div
                        className="selectedImg"
                        key={i}
                        id={i}
                        style={{ backgroundImage: `url(${img})` }}
                      >
                        <div
                          className="close"
                          onClick={() => {
                            removeImage(i);
                          }}
                        >
                          <AiOutlineCloseCircle />
                        </div>
                      </div>
                    );
                  })}
                  <Uploader
                    addImage={addImage}
                    error={imgError}
                    clearError={() => {
                      setImgError(false);
                    }}
                  />
                </div>
                <div className="mt-3 news-progress">
                  {progress && (
                    <ProgressBar
                      animated
                      now={progress}
                      label={`${progress}%`}
                    />
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={3}>
            <Card className={"mb-3 " + (catError ? "error" : "")}>
              <Card.Body className="ms-0">
                <Autocomplete
                  options={categories}
                  changeCat={changeCat}
                  clearError={() => {
                    setCatError(false);
                  }}
                />
                <div className="mt-3">
                  {category.map((val, index) => {
                    return (
                      <span key={index} className="selected-cat mb-2">
                        {val}{" "}
                        <IoCloseSharp
                          className="close-cat mx-1"
                          onClick={() => {
                            deleteCat(index);
                          }}
                        />
                      </span>
                    );
                  })}
                </div>
                <button className="save-btn mt-2" onClick={handleDraft}>
                  <IoSaveOutline className="me-2"/>
                  Save Draft
                </button>
                <button className="publish-btn mt-2" onClick={handleSave}>
                  <VscGlobe className="me-2" />
                  Publish
                </button>
              </Card.Body>
            </Card>

            <Card className="mt-3 p-2 mb-3">
              <Card.Body className="ms-0">
                <div className="d-flex">
                  <span className="me-3 toggle-text">
                    <RiMoneyDollarCircleLine style={{ fontSize: "20px" }} />{" "}
                    Enable monetization
                  </span>
                  <Switch
                    id="monetize"
                    isOn={monetize}
                    onColor="#009C35"
                    handleToggle={() => setMonetize(!monetize)}
                  />
                </div>

                {!monetize && (
                  <div className="info">
                    Random Ads will be shown on your news post if you enable
                    this option
                  </div>
                )}

                <div className="d-flex mt-3">
                  <span className="me-3 toggle-text">
                    <BiCommentX style={{ fontSize: "20px" }} /> Disable
                    Commenting
                  </span>
                  <Switch
                    id="comment"
                    isOn={comment}
                    onColor="#009C35"
                    handleToggle={() => setComment(!comment)}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
