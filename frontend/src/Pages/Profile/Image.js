import React, { PureComponent } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { withStyles } from "@mui/material/styles";
import {IoCameraOutline} from "react-icons/io5";
import {AiOutlineDelete} from "react-icons/ai";
import defaultPic from "../../Images/default.svg";
import { BACKEND_URL } from "../../constants/url";
import { changeDp, removeDp } from "../../actions/userActions";
import { CircularProgress } from "@mui/material";

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
    loading:false,
    src: null,
    crop: {
      unit: "%",
      width: 30,
      aspect: 1 / 1
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

  showLoading = () => {
    this.setState({ loading: true });
  }

  hideLoading = () => {
    this.setState({ loading: false });
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>{
        
        this.setState({ src: reader.result })
        this.setState({ open: true });
      }
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
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
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
      }, "image/jpeg");
    });
  }

  render() {
    let fileInput = React.createRef();
    const { crop, croppedImageUrl, loading, src } = this.state;
    const { user, handleRemove } = this.props;
    return (
      <div>
        
        <div className='d-flex user-profile-pic-parent'>
          { !loading 
           ? <><span className="user-profile-pic flex-column" 
                style={{
                  backgroundImage:`url(${user?.image? BACKEND_URL+'/uploads/'+user?.image : defaultPic })`
                }}>
            </span>
            <div className="hide pro-upload-btn pointer" onClick={()=>fileInput.current.click()}>
              <IoCameraOutline className="me-1"/>Upload pic</div>
            <div className="hide remove-btn pointer" 
              onClick={async ()=>{
                let status = await removeDp()
                if(status) handleRemove()
              }}>
                <AiOutlineDelete className="me-1"/>Remove</div></>
           : <span className="user-profile-pic blured flex-column" 
                style={{backgroundImage:`url(${croppedImageUrl})`}}>
                  <CircularProgress color="success" />
            </span>
          }

        </div>

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

            {src && 
            
            <div className="d-flex justify-content-end">
            <Button onClick={() => fileInput.current.click()}>
              {src === null ? "Upload Photo" : "Change Photo"}
            </Button>
            </div> 
            
            }

            
            {src !== null ? (
              <Button onClick={async () => {
                const {showLoading,hideLoading} = this
                const { changeImageState } = this.props

                let blob = await fetch(croppedImageUrl).then(r => r.blob());
                this.handleClose()
                fileInput.current.value = "";
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = async function () {
                  let base64String = reader.result;
                  showLoading()
                  let {status, message, key } = await changeDp(base64String)
                  hideLoading();
                  if(status) {
                    changeImageState(key)
                  }
                };
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