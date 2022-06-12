import {
  Avatar,
  Button,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Skeleton,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  AiOutlineInfoCircle,
  AiOutlineLock,
  AiOutlineMail,
} from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsCashStack, BsTelephone } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  changeName,
  changePassword,
  changePhone,
  getUserProfile,
  verifyUser,
} from "../../actions/userActions";
import Header from "../../components/Header/Header";
import { UPDATE_USER } from "../../constants/actionTypes";
import { BACKEND_URL } from "../../constants/url";
import ProfilePic from "./Image";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSnackbar } from "notistack";
import { verifyPassword, verifyPhone } from "../../validations/profileForm";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import emptyImg from "../../Images/empty.png";
import "./Profile.css";

function Profile() {
  const { authUser, showTopProgress } = useSelector((state) => state);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [fullData, setFullData] = useState({ loading: false, done: false });
  const [isNameEditable, setNameEditable] = useState(false);
  const [edittedName, setEdittedName] = useState("");
  const [isPhoneEditable, setPhoneEditable] = useState(false);
  const [edittedPhone, setEdittedPhone] = useState("");
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    document.title = "Profile - Newsonic"
    dispatch(verifyUser());
  }, []);

  useEffect(() => {
    setUser(authUser.user);
    !fullData.done && fetchUserProfile();
  }, [authUser]);

  const fetchUserProfile = async () => {
    dispatch({ type: "SHOW_PROGRESS" });
    setFullData((prev) => ({ ...prev, loading: true }));
    let profile = await getUserProfile();
    dispatch({ type: "HIDE_PROGRESS" });
    if (profile.status) {
      setFullData((prev) => ({
        ...prev,
        loading: false,
        ...profile,
        done: true,
      }));
    }
  };

  const changeImageState = (key) => {
    user.image = key;
    dispatch({
      type: UPDATE_USER,
      payload: user,
    });
    showToast("Image changed successfully!", "success");
  };

  const handleRemove = () => {
    user.image = null;
    dispatch({
      type: UPDATE_USER,
      payload: user,
    });
  };

  const handlenameChange = async () => {
    dispatch({ type: "SHOW_PROGRESS" });
    let status = await changeName(edittedName);
    if (status) {
      setNameEditable(false);
      setEdittedName("");
      dispatch({ type: "HIDE_PROGRESS" });
      user.name = edittedName;
      dispatch({
        type: UPDATE_USER,
        payload: user,
      });
      showToast("Name changed successfully!", "success");
    } else showToast("Operation failed", "error");
  };

  const handlePhoneChange = async () => {
    if (verifyPhone(edittedPhone)) {
      dispatch({ type: "SHOW_PROGRESS" });
      let status = await changePhone(edittedPhone);
      if (status) {
        setPhoneEditable(false);
        setEdittedPhone("");
        dispatch({ type: "HIDE_PROGRESS" });
        user.phone = edittedPhone;
        dispatch({
          type: UPDATE_USER,
          payload: user,
        });
        showToast("Phone changed successfully!", "success");
      } else showToast("Operation failed", "error");
    } else {
      showToast("Enter a valid phone number", "error");
    }
  };

  const showToast = (message, variant) => {
    enqueueSnackbar(message, { variant: variant });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword((prev) => ({
      ...prev,
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    }));
    setPasswordErrors((prev) => ({
      ...prev,
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    }));
  };

  const handlePasswordChange = async () => {
    if (verifyPassword(password, setPasswordErrors)) {
      dispatch({ type: "SHOW_PROGRESS" });
      const { newPassword, oldPassword } = password;
      const { status, message } = await changePassword({
        newPassword,
        oldPassword,
      });
      dispatch({ type: "HIDE_PROGRESS" });
      if (status) {
        showToast("Password changed successfully!", "success");
        handleClose();
      } else showToast(message, "error");
    }
  };

  return (
    <>
      <style>
        {
          "body {background: linear-gradient(white 5%, #ddf0e6); background-attachment: fixed;}"
        }
      </style>
      <Header />
      <Container className="profile-main-content">
        <Row>
          <Col xl={6} className="profile-left-sec pt-5">
            <Paper className="profile-card">
              <div className="content-center">
                <div className="profile-pic">
                  <ProfilePic
                    user={user}
                    changeImageState={changeImageState}
                    handleRemove={handleRemove}
                  />
                </div>
              </div>
              {!isNameEditable ? (
                <p className="username mb-0">
                  {user?.name}{" "}
                  <EditIcon
                    className="pointer"
                    onClick={() => {
                      setNameEditable(true);
                      setEdittedName(user?.name);
                    }}
                  />
                </p>
              ) : (
                <p className="username mb-0">
                  <TextField
                    className="mt-2"
                    variant="standard"
                    value={edittedName}
                    onChange={(e) => {
                      setEdittedName(e.target.value);
                    }}
                  />
                  <CancelIcon
                    className="pointer"
                    onClick={() => {
                      setNameEditable(false);
                      setEdittedName("");
                    }}
                  />
                  {user?.name !== edittedName && (
                    <CheckCircleIcon
                      className="submitTick"
                      onClick={handlenameChange}
                    />
                  )}
                </p>
              )}

              <p className="userid mb-0">USER ID: {user?._id}</p>
              <div className="info-section">
                <p>
                  <span className="titles">
                    <AiOutlineMail className="me-2" />
                    email
                  </span>
                  <span className="value ms-3">{user?.email}</span>
                </p>
                <p>
                  <span className="titles">
                    <BsTelephone className="me-2" />
                    Phone
                  </span>
                  <span className="value ms-3">
                    <>
                      {!isPhoneEditable ? (
                        user?.phone ? (
                          <>
                            {user?.phone}
                            <EditIcon
                              className="pointer"
                              onClick={() => {
                                setPhoneEditable(true);
                                setEdittedPhone(user?.phone);
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <span
                              onClick={() => {
                                setPhoneEditable(true);
                                setEdittedPhone(user?.phone);
                              }}
                            >
                              <Link class="profile-link">Add number</Link>
                            </span>
                          </>
                        )
                      ) : (
                        <>
                          <TextField
                            variant="standard"
                            value={edittedPhone}
                            onChange={(e) => {
                              setEdittedPhone(e.target.value);
                            }}
                          />
                          <CancelIcon
                            className="pointer"
                            onClick={() => {
                              setPhoneEditable(false);
                              setEdittedPhone(null);
                            }}
                          />
                          {user?.phone !== edittedPhone && (
                            <CheckCircleIcon
                              className="submitTick"
                              onClick={handlePhoneChange}
                            />
                          )}
                        </>
                      )}
                    </>
                  </span>
                </p>
                <p>
                  <span className="titles">
                    <BiUser className="me-2" />
                    Type
                  </span>
                  <span className="value ms-3">
                  {
                    user?.type === 'google' 
                    ? <><FcGoogle/> Google user</> 
                    : <span><MdEmail/> Email user</span>
                  }</span>
                </p>
                {user?.type === "normal" && (
                  <p>
                    <span className="titles">
                      <AiOutlineLock className="me-2" />
                      Password
                    </span>
                    <span
                      className="value ms-3 pointer"
                      onClick={handleClickOpen}
                    >
                      <Link class="profile-link">Change</Link>
                    </span>
                  </p>
                )}
              </div>
            </Paper>
          </Col>
          <Col xl={6}>
            <Row className="profile-right-sec mt-4">
              <Col md={6}>
                <Paper className="channel-card">
                    <div className="holder">
                      <p className="profile-card-head">
                        <AiOutlineInfoCircle className="me-2" />
                        Channel Info
                      </p>
                      {(fullData.loading || fullData.channel) ?
                       <CardHeader
                        avatar={
                          fullData.loading ? (
                            <Skeleton
                              variant="circular"
                              width={40}
                              height={40}
                            />
                          ) : 
                           fullData?.channel 
                           &&
                              <Avatar
                              alt={fullData?.channel?.name}
                              src={`${BACKEND_URL}/uploads/${fullData?.channel?.image}`}
                            />
                                
                        }
                        title={
                          fullData.loading ? (
                            <Skeleton height={25} />
                          ) : (
                            fullData?.channel?.name
                          )
                        }
                        subheader={
                          fullData.loading ? (
                            <Skeleton height={20} width="50%" />
                          ) : fullData?.channel?.isApproved && "Active"
                        
                        }
                      />:
                      <>
                      <div className="content-center">
                        <Avatar className="mt-1 mb-2">
                        <DoDisturbAltIcon />
                      </Avatar> 
                        </div>
                        <p className="text-center fw-500 f-dark-gray">No Channels</p>
                        </>
                      }
                
                      {fullData?.loading ? (
                        <Skeleton
                          sx={{ bgcolor: "green" }}
                          width={"100%"}
                          height={55}
                          className="mt-2"
                        />
                      ) : (
                        <>
                          <Button className="console-btn" onClick={()=>navigate('/creator')}>
                           {fullData?.channel ? 'GO TO CONSOLE' : 'CREATE CHANNEL'} 
                          </Button>
                        </>
                        
                      )}
                    </div>
                </Paper>
              </Col>

              <Col md={6}>
                <Paper className="channel-card">
                  <div className="holder">
                    <p className="profile-card-head">
                      <BsCashStack className="me-2" />
                      Sponsor Info
                    </p>
                    <p className="content-center ad-count">
                      {fullData.loading ? (
                        <CircularProgress color="success" className="mb-2" />
                      ) : (
                        fullData?.adCount
                      )}
                    </p>
                    <p className="content-center">
                      {fullData.loading ? (
                        <Skeleton width={"40%"} />
                      ) : (
                        "Posted Ads"
                      )}
                    </p>

                    {fullData?.loading ? (
                      <Skeleton
                        sx={{ bgcolor: "green" }}
                        width={"100%"}
                        height={55}
                      />
                    ) : (
                      <Button className="console-btn" onClick={()=>navigate('/sponsor')}>
                        {fullData?.adCount !== 0 ? 'Dashboard' : 'POST AD'}
                      </Button>
                    )}
                  </div>
                </Paper>
              </Col>
            </Row>
            <Row>
              <Col>
                <Paper className="saved-card mb-5">
                  <div class="holder">
                    {fullData?.savedPosts &&
                      fullData?.savedPosts.length !== 0 && <p className="profile-card-head">
                      <BsCashStack className="me-2" />
                      Saved posts
                    </p>}

                    {fullData.loading ? (
                      <>
                        {[...Array(2)].map((post, i, arr) => {
                          return (
                            <>
                              <CardHeader
                                avatar={
                                  <Avatar
                                    alt={
                                      <Skeleton
                                        variant="circular"
                                        width={40}
                                        height={40}
                                      />
                                    }
                                    src={`${BACKEND_URL}/uploads/${post?.images[0]}`}
                                    variant="square"
                                  />
                                }
                                title={<Skeleton height={25} width={"80%"} />}
                                subheader={
                                  <Skeleton height={20} width={"40%"} />
                                }
                                className={i === arr.length - 1 && "mb-5"}
                              />
                              {i === arr.length - 1 && (
                                <Skeleton
                                  sx={{ bgcolor: "#45a33c" }}
                                  width={"100%"}
                                  height={55}
                                  className="mt-2"
                                />
                              )}
                            </>
                          );
                        })}
                      </>
                    ) : fullData?.savedPosts &&
                      fullData?.savedPosts.length !== 0 ? (
                      <>
                        {fullData?.savedPosts
                          .slice(0, 3)
                          .map((post, i, arr) => {
                            return (
                              <>
                                <div className="pointer"
                                onClick={()=>{
                                  navigate(`/post/${post._id}`)
                                }}>
                                <CardHeader
                                  avatar={
                                    <Avatar
                                      alt={post?.newsHead}
                                      src={`${BACKEND_URL}/uploads/${post?.images[0]}`}
                                      variant="square"
                                    />
                                  }
                                  title={post?.newsHead}
                                  subheader={post?.postDate}
                                  className={
                                    i === arr.length - 1 && 
                                    ( arr.length === 1 ? "mb-5" : "mb-2")
                                  }
                                />
                                </div>
                                {i === arr.length - 1 && (
                                  <Button className="plane-btn" onClick={()=>navigate('/post/saved')}>
                                    VIEW ALL SAVED
                                  </Button>
                                )}
                              </>
                            );
                          })}
                      </>
                    ) : (
                      <div>
                        <p className="content-center mt-2"><img src={emptyImg} draggable={false}></img></p>
                        <p className="content-center fw-500 f-17 f-dark-gray">No Saved Post</p>
                        <p className="content-center text-center f-gray f-15 mb-4">You don't have any saved posts.<br/>Start saving posts</p>
                      </div>
                    )}
                  </div>
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Change password"}</DialogTitle>
          <DialogContent className="change-password-dialog">
            <DialogContentText id="alert-dialog-description">
              <TextField
                className="w-100"
                id="filled-basic"
                color="success"
                label="Old Password"
                variant="filled"
                type="password"
                value={password.oldPassword}
                onChange={(e) => {
                  setPassword((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }));
                }}
                error={passwordErrors.oldPassword}
                helperText={passwordErrors.oldPassword}
              />
              <br />
              <TextField
                className="w-100 mt-2"
                color="success"
                id="filled-basic"
                label="New password"
                variant="filled"
                type="password"
                onChange={(e) => {
                  setPassword((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }));
                }}
                error={passwordErrors.newPassword}
                helperText={passwordErrors.newPassword}
              />
              <TextField
                className="w-100 mt-2"
                color="success"
                id="filled-basic"
                label="Confirm password"
                type="password"
                variant="filled"
                onChange={(e) => {
                  setPassword((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                }}
                error={passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!showTopProgress && (
              <>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handlePasswordChange} autoFocus>
                  CHANGE
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default Profile;
