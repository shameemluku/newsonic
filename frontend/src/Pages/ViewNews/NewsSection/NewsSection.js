import React, { useCallback, useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants/url";
import Skeleton from "@mui/material/Skeleton";
import { Col, Row } from "react-bootstrap";
import ImageViewer from "react-simple-image-viewer";

export default function NewsSection({ data }) {
  const [isLoaded, setLoaded] = useState(false);
  const [paraArray, setParaArray] = useState([]);
  const [imagePos, setImagePos] = useState();
  const [imageDiv, setimageDiv] = useState();
  const [images, setImages] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    data?.newsBody && findPara();
    createImageDiv();
    data?.images && images.length===0 && createImageArray();
  }, [data]);

  const findPara = () => {
    let result = data?.newsBody.split("\n");
    let finalParaArray = result.filter((val) => {
      if (val !== "") return val;
    });
    setParaArray([...finalParaArray]);
    setImagePos(
      paraArray.length > 3 && data.images.length > 1
        ? parseInt(paraArray.length / 2)
        : paraArray.length
    );
  };


  const createImageArray = () =>{
      data?.images.map((val)=>{
          images.push(`${BACKEND_URL}/uploads/${val}`)
          setImages([...images])
      })
      console.log(images);
  }

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
            <Col sm={6}>
              <img
                className="w-100 pointer"
                src={`${BACKEND_URL}/uploads/${data?.images[1]}`}
                alt=""
                onClick={()=>openImageViewer(1)}
              ></img>
            </Col>
            <Col sm={6}>
              <img
                className="w-100 pointer"
                src={`${BACKEND_URL}/uploads/${data?.images[2]}`}
                alt=""
                onClick={()=>openImageViewer(2)}
              ></img>
            </Col>
          </Row>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="line" />
      <div className="view-heading">
        <h1>
          {data?.newsHead ? (
            data?.newsHead
          ) : (
            <>
              <Skeleton height={"40px"} />
              <Skeleton height={"40px"} />
              <Skeleton height={"40px"} width={"75%"} />
            </>
          )}
        </h1>

        {data?.images && (
          <img
            width={"100%"}
            style={{ objectFit: "cover" }}
            src={`${BACKEND_URL}/uploads/${data?.images[0]}`}
            className={`${!isLoaded ? "hide" : ""} pointer`}
            alt=""
            onClick={()=>openImageViewer(0)}
            onLoad={() => {
              setLoaded(true);
            }}
          ></img>
        )}

        {!isLoaded && (
          <Skeleton variant="rectangular" width={"100%"} height={"500px"} />
        )}
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
              }
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
                  backgroundColor: "rgba(0,0,0,0.9)"
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
