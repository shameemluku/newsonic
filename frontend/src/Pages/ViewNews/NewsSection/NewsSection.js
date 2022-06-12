import React, { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants/url";
import Skeleton from "@mui/material/Skeleton";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { Col, Row } from "react-bootstrap";
import ImageViewer from "react-simple-image-viewer";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MessageIcon from "@mui/icons-material/Message";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { likePost, savePost, translateText } from "../../../actions/postActions";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function NewsSection({ data }) {
  const [isLoaded, setLoaded] = useState(false);
  const [paraArray, setParaArray] = useState([]);
  const [newsHead, setNewsHead] = useState(null);
  const [imagePos, setImagePos] = useState();
  const [imageDiv, setimageDiv] = useState();
  const [images, setImages] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const dispatch = useDispatch();
  const { authUser: authData } = useSelector((state) => state);
  const [defaultValues, setDefault] = useState({
    newsHead:"",
    newsBody:[]
  });

  useEffect(() => {
    
    if(data?.newsBody && data?.newsHead){
      findPara();
      setHead();
    }
    data?.images && images.length === 0 && createImageArray();
    createImageDiv();
  }, [data]);


  const setHead = () => {
    setNewsHead(data?.newsHead)
    setDefault((prev)=>({
      ...prev,
      newsHead:data?.newsHead
    }))
  }

  const findPara = () => {
    let result = data?.newsBody.split("\n");
    let finalParaArray = result.filter((val) => {
      if (val !== "") return val;
    });
    setParaArray([...finalParaArray]);
    setDefault((prev)=>({
      ...prev,
      newsBody:finalParaArray
    }))
    setImagePos(
      paraArray.length > 3 && data.images.length > 1
        ? parseInt(paraArray.length / 2)
        : paraArray.length
    );
  };

  const createImageArray = () => {
    data?.images.map((val) => {
      images.push(`${BACKEND_URL}/uploads/${val}`);
      setImages([...images]);
    });
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const createImageDiv = () => {
    setimageDiv(
      <div>
        {data?.images && (
          <Row>
            {data?.images[1] && <Col sm={6}>
              <img
                className="w-100 pointer"
                src={`${BACKEND_URL}/uploads/${data?.images[1]}`}
                alt=""
                onClick={() => openImageViewer(1)}
              ></img>
            </Col>}
            {data?.images[2] && <Col sm={6}>
              <img
                className="w-100 pointer"
                src={`${BACKEND_URL}/uploads/${data?.images[2]}`}
                alt=""
                onClick={() => openImageViewer(2)}
              ></img>
            </Col>}
          </Row>
        )}
      </div>
    );
  };

  const handleLike = () => {
    dispatch(
      likePost(
        {
          userId: authData?.user?._id,
          postId: data?._id,
        },
        data
      )
    );
  };

  const handleSave = () => {
    dispatch(
      savePost(
        {
          userId: authData?.user?._id,
          postId: data?._id,
        },
        data
      )
    );
  };

  const [language, setLanguage] = useState('en');

  const handleChange = (event, newLanguage) => {
    setLanguage(newLanguage);
  };

  useEffect(()=>{
    
    if(data?.newsBody && data?.newsHead){
      if(language!=='en' && language!==null){
        changeLanguage(language)
      }else{
        findPara();
        setHead();
      }
    }
  },[language])

  const changeLanguage = async (language) => {

    dispatch({type:'SHOW_PROGRESS'})
    let promises = []
    let heading = await translateText(defaultValues?.newsHead,language)
    setNewsHead(heading)
    defaultValues?.newsBody.map(async (val)=>{
      promises.push(translateText(val,language)); 
    })

    Promise.all(promises).then((data)=>{
      setParaArray([...data])
    })
    dispatch({type:'HIDE_PROGRESS'})

  }

  return (
    <>
      <div className="line" />
      <div className="view-heading">
        <h1>
          {newsHead ? (
            newsHead
          ) : (
            <>
              <Skeleton height={"40px"} />
              <Skeleton height={"40px"} width={"75%"} />
            </>
          )}
        </h1>

        <CardHeader
          className="p-0 mb-3"
          avatar={
            !data?.channelDetails ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : (
              <Avatar
                alt={data?.channelDetails[0].name}
                src={`${BACKEND_URL}/uploads/propic-${data?.channelDetails[0]._id}`}
              />
            )
          }
          title={
            !data?.channelDetails ? (
              <Skeleton
                animation="wave"
                height={20}
                width="30%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              data?.channelDetails[0].name
            )
          }
          subheader={
            !data?.channelDetails ? (
              <Skeleton animation="wave" height={20} width="60%" />
            ) : (
              `Updated: ${moment(data?.postDate).format(
                "ddd MMM DD YYYY hh:mm:ss"
              )}`
            )
          }
        />

        {data?.images && (
          <img
            width={"100%"}
            style={{ objectFit: "cover" }}
            src={`${BACKEND_URL}/uploads/${data?.images[0]}`}
            className={`${!isLoaded ? "hide" : ""} pointer`}
            alt=""
            onClick={() => openImageViewer(0)}
            onLoad={() => {
              setLoaded(true);
            }}
          ></img>
        )}


        {!isLoaded && (
          <Skeleton variant="rectangular" width={"100%"} height={"500px"} />
        )}
      </div>

      {/* ////////////////////////////////////////// */}

      <div className="w-100 d-flex justify-content-between post-action-sec">
        <div className="left-section d-flex">
          {authData?.user !== null && (
            <>
              <div
                className="likeBtn"
                onClick={() => {
                  handleLike();
                }}
              >
                {data?.isLiked ? (
                  <ThumbUpIcon
                    className="pointer me-2"
                    sx={{ fontSize: "27px" }}
                  />
                ) : (
                  <ThumbUpOutlinedIcon
                    className="pointer me-2"
                    sx={{ fontSize: "27px" }}
                  />
                )}
              </div>
            </>
          )}

          <div className="mt-1">
            <b>{data?.likes}</b>&nbsp;<span className={`${authData?.user !== null && 'mob-hide'}`}>likes</span>
          </div>

          <div
            className="mt-1 ms-3 pointer"
            onClick={() => {
              window.location.replace("#comments");
            }}
          >
            <MessageIcon />
            &nbsp;<b>{data?.comments?.length}</b> <span className="ms-1 mob-hide">Comments</span>
          </div>
        </div>

        <div className="left-section d-flex">

        <ToggleButtonGroup
          size="small"
          value={language}
          exclusive
          onChange={handleChange}
        >
          <ToggleButton className="px-3 lang-btn" name='lang' value="en">E</ToggleButton>
          <ToggleButton className="px-3 lang-btn" name='lang' value="ml">മ</ToggleButton>
          <ToggleButton className="px-3 lang-btn" name='lang' value="hi">हा</ToggleButton>
        </ToggleButtonGroup>

          <span className="news-views ms-3"><VisibilityIcon/>&nbsp;&nbsp;{data?.views}</span>

          {authData?.user !== null && (
            <div
              className="ms-3"
              onClick={() => {
                handleSave();
              }}
            >
              {data?.isSaved ? (
                <BsBookmarkFill size={"22px"} />
              ) : (
                <BsBookmark className="pointer" size={"22px"} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="view-details">
        {data?.newsBody ? (
          <>
            {paraArray.map((val, i) => {
              if (i === imagePos) {
                return (
                  <>
                    {imageDiv}
                    {<pre>{"\n\n" + val + "\n\n"}</pre>}
                  </>
                );
              }else if(i===0) return <pre className="firstPre">{val + "\n\n"}</pre>
              return <pre>{val + "\n\n"}</pre>;
            })}

            {imagePos === paraArray.length &&
              data?.images.length > 1 &&
              imageDiv}

            {isViewerOpen && (
              <ImageViewer
                src={images}
                currentIndex={currentImage}
                onClose={closeImageViewer}
                backgroundStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                }}
                className={"d-none"}
              />
            )}
          </>
        ) : (
          <>
            <Skeleton width={"100%"} />
            <Skeleton width={"100%"} />
            <Skeleton width={"100%"} />
            <Skeleton width={"80%"} />
          </>
        )}
      </div>
    </>
  );
}
