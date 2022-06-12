import React, { PureComponent } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { withStyles } from "@mui/material/styles";
import { IoCameraOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import defaultPic from "../../../Images/default.jpg";
import { Col } from "react-bootstrap";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
};

class AlertDialogSlide extends PureComponent {
  state = {
    open: false,
    src: null,
    crop: {
      unit: "%",
      width: 90,
      aspect: this.props.ratio[0] / this.props.ratio[1],
    },
  };

  clearState = () => {
    this.setState({
      open: false,
      src: null,
      croppedImageUrl: null,
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ src: reader.result });
        this.setState({ open: true });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    let fileInput = React.createRef();
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <Col md={6} className="content-center">
        <span
          className={`ad-format1 flex-column mb-2 ${this.props.error && 'error-image-box'}`}
          style={{
            backgroundImage: `url(${
              this.props.cropImage ? this.props.cropImage : defaultPic
            })`,
          }}
        >
          <div className="hide upload-btn" onClick={() => fileInput.current.click()}>
            <IoCameraOutline className="me-1" />
            Upload pic
          </div>
        </span>

        {/* onClick={this.handleClickOpen} */}

        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.TransitionComponenthandleClose}
        >
          <DialogTitle>{"Crop Image"}</DialogTitle>
          <DialogContent>
            <input
              type="file"
              ref={fileInput}
              style={{ display: "none" }}
              onChange={this.onSelectFile}
              multiple
            />
            

            {src && (
              <ReactCrop
                src={src}
                crop={crop}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              close
            </Button>

            {src && (
              <div className="d-flex justify-content-end">
                <Button onClick={() => fileInput.current.click()}>
                  {src === null ? "Upload Photo" : "Change Photo"}
                </Button>
              </div>
            )}

            {src !== null ? (
              <Button
                onClick={async () => {
                  let blob = await fetch(croppedImageUrl).then((r) => r.blob());
                  this.handleClose();
                  fileInput.current.value = "";
                  this.props.addImage(blob, this.props.imgState);
                  this.props.clearError()
                }}
              >
                Save Photo
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>
      </Col>
    );
  }
}

export default AlertDialogSlide;
