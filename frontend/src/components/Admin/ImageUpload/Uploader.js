import React, { PureComponent } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import ReactCrop from "react-image-crop";
import { withStyles } from "@mui/material/styles";
import "react-image-crop/dist/ReactCrop.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = {
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh"
  }
};

class AlertDialogSlide extends PureComponent {
  state = {
    open: false,
    src: null,
    crop: {
      unit: "%",
      width: 90,
      aspect: 16 / 9
    }
  };

  clearState = () => {
    this.setState({
      open:false,
      src:null,
      croppedImageUrl:null
    })
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
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
    canvas.width = Math.ceil(crop.width*scaleX);
    canvas.height = Math.ceil(crop.height*scaleY);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width*scaleX,
      crop.height*scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg",1);
    });
  }

  render() {
    let fileInput = React.createRef();
    const { crop, croppedImageUrl, src } = this.state;
    return (
      <div>
        
        <div className='d-flex'>
            <div className={this.props.error?"image-add-tbn error":"image-add-tbn"} 
              onClick={this.handleClickOpen}>+</div>
        </div>

        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.TransitionComponenthandleClose}
        >
          <DialogTitle>{"Add Images"}</DialogTitle>
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

            {src && 
            
            <div className="d-flex justify-content-end">
            <Button onClick={() => fileInput.current.click()}>
              {src === null ? "Upload Photo" : "Change Photo"}
            </Button>
            </div> 
            
            }

            {src && <div style={{color:"red",fontWeight:"500"}}>Cropped Image: </div> }

            {croppedImageUrl && (
              <img
                alt="Crop"
                className="mt-3"
                style={{ maxWidth: "100%" }}
                src={croppedImageUrl}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              close
            </Button>
            {src===null && <Button onClick={() => fileInput.current.click()}>
              Upload Photo
            </Button>}
            {src !== null ? (
              <Button onClick={async () => {
                let blob = await fetch(croppedImageUrl).then(r => r.blob());
                this.props.clearError()
                this.clearState()
                fileInput.current.value = "";
                this.props.addImage(blob)

              }}>
                Save Photo
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialogSlide;