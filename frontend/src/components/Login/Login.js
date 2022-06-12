import React, { useState, useEffect } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { MdErrorOutline } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { VariantType, useSnackbar } from "notistack";
import { GoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { signUp, signIn } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  isRegisterValid,
  isEmailValid,
  isPassValid,
} from "../../validations/registerForm";
import "../Login/Login.css";
import { CircularProgress } from "@mui/material";
import newspaper from "../../Images/peanut.svg";
import newspaper1 from "../../Images/newspaper.svg";
import newspaper2 from "../../Images/newspaper2.svg";
import google from "../../Images/google.svg";

function Login(props) {
  const [toggleLogin, setToggle] = useState(true);
  const [loginFields, setLoginField] = useState({ email: "", password: "" });
  const [registerFields, setRegisterField] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    type: "normal",
  });
  const [loginErrors, setLoginError] = useState({
    email: false,
    password: false,
  });

  const [registerErrors, setRegisterError] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
  });

  const { authUser, posts } = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [response, setResponse] = useState({ status: false, message: "" });
  const images = [newspaper, newspaper1, newspaper2];

  function handleLogin() {
    let isValid = true;

    if (!isEmailValid(loginFields, setLoginError, enqueueSnackbar))
      isValid = false;
    if (!isPassValid(loginFields, setLoginError, enqueueSnackbar))
      isValid = false;
    if (isValid) {
      let params = {
        loginFields,
        setResponse,
        response,
        hideModal: props.onHide,
        setLoginField,
      };
      dispatch(signIn(params));
    }
  }

  //User Register API Call

  function handleRegister() {
    if (isRegisterValid(registerFields, setRegisterError, registerErrors)) {
      setRegisterField({ ...registerFields, type: "normal" });
      let params = {
        registerFields,
        setResponse,
        response,
        hideModal: props.onHide,
        setRegisterField,
      };

      dispatch(signUp(params));
    }
  }

  const googleSuccess = async (res) => {
    const result = res.profileObj;
    const token = res.tokenId;

    let userData = {
      email: result.email,
      name: result.givenName,
      phone: null,
      type: "google",
    };

    try {
      let params = {
        registerFields: userData,
        setResponse,
        response,
        hideModal: props.onHide,
      };

      dispatch(signUp(params));
    } catch (error) {}
  };

  const googleFailure = () => {
    enqueueSnackbar("Google Sign in error!", { variant: "error" });
  };

  useEffect(() => {
    if (response.status)
      enqueueSnackbar(response.message, { variant: "error" });
  }, [response]);

  return (
    <>
      {toggleLogin ? (
        ""
      ) : (
        <style>{`.modal-body{ height:fit-content !important;}`}</style>
      )}
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.486)" }}
        className="login-modal"
        centered
      >
        <Modal.Body className="p-0">
          {toggleLogin ? (
            <Container className="p-0">
              <Row>
                <Col className="p-0 login-image">
                  <img
                    src={images[Math.floor(Math.random() * images.length)]}
                    alt=""
                    draggable="false"
                  ></img>
                </Col>
                <Col className="d-flex flex-column w-100">
                  <div className="w-100 d-flex justify-content-end pe-4 mt-3">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setLoginField({
                          ...loginFields,
                          email: "",
                          password: "",
                        });
                        setLoginError({});
                        setRegisterError({});
                        setRegisterField({
                          ...registerFields,
                          name: "",
                          email: "",
                          password: "",
                          phone: "",
                        });
                        props.onHide();
                        dispatch({ type: "CLOSE_MODAL" });
                      }}
                    >
                      <GrClose />
                    </span>
                  </div>
                  <div className="right-content align-self-center px-5">
                    <p className="login-message">
                      Join the biggest News network
                    </p>
                    <input
                      type="email"
                      className={
                        loginErrors.email
                          ? "login-input input-mail error"
                          : "login-input input-mail"
                      }
                      placeholder="Email address"
                      style={{ width: "100%" }}
                      value={loginFields.email}
                      onChange={(e) => {
                        setLoginField({
                          ...loginFields,
                          email: e.target.value,
                        });
                        setLoginError({ ...loginErrors, email: false });
                      }}
                      autoComplete="email"
                    />

                    <input
                      type="password"
                      className={
                        loginErrors.password
                          ? "login-input mt-2 input-pass error"
                          : "login-input mt-2 input-pass"
                      }
                      placeholder="Password"
                      style={{ width: "100%" }}
                      value={loginFields.password}
                      onChange={(e) => {
                        setLoginField({
                          ...loginFields,
                          password: e.target.value,
                        });
                        setLoginError({ ...loginErrors, password: false });
                      }}
                    />

                    {!authUser.signInLoading ? (
                      <input
                        type="button"
                        className="login-button mt-2"
                        style={{ width: "100%" }}
                        value="Sign In"
                        onClick={() => {
                          handleLogin();
                        }}
                      />
                    ) : (
                      <p className="user-sign-loading content-center mt-5">
                        <CircularProgress
                          size={25}
                          color="success"
                          className="me-2"
                        />
                        Getting you in
                      </p>
                    )}

                    <div className="login-line"></div>

                    {!authUser.signUpLoading ? (
                      <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_ID}
                        render={(renderProps) => (
                          <div className="login-google w-100 text-center">
                            <img src={google} height="40px" alt="" />
                            <span onClick={renderProps.onClick}>Google</span>
                          </div>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                      />
                    ) : (
                      <p className="user-sign-loading content-center mt-4">
                        <CircularProgress
                          size={25}
                          color="success"
                          className="me-2"
                        />
                        Getting you in
                      </p>
                    )}
                  </div>
                  <div className="register-button align-self-center mt-4">
                    <span className="justify-content-center me-2">
                      Or create new account
                    </span>
                    <span
                      style={{ color: "#C77514", cursor: "pointer" }}
                      onClick={() => setToggle(false)}
                    >
                      Register
                    </span>
                  </div>
                </Col>
              </Row>
            </Container>
          ) : (
            <Container className="signup">
              <Row>
                <Col className="d-flex flex-column w-100">
                  <div className="w-100 d-flex justify-content-end pe-4 mt-3">
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setLoginField({
                          ...loginFields,
                          email: "",
                          password: "",
                        });
                        setLoginError({});
                        setRegisterError({});
                        setRegisterField({
                          ...registerFields,
                          name: "",
                          email: "",
                          password: "",
                          phone: "",
                        });
                        props.onHide();
                      }}
                    >
                      <GrClose />
                    </span>
                  </div>
                  <div className="signup-holder w-100 d-flex justify-content-center px-5 mt-4">
                    <div className="signup-fields w-75">
                      <p className="login-message">
                        Join the biggest News network
                      </p>

                      <TextField
                        id="outlined-basic"
                        type="text"
                        label="Firstname"
                        variant="outlined"
                        className="w-100"
                        value={registerFields.name}
                        onChange={(e) => {
                          setRegisterField({
                            ...registerFields,
                            name: e.target.value,
                          });
                          setRegisterError((prevState) => ({
                            ...prevState,
                            name: "",
                          }));
                        }}
                        error={registerErrors.name}
                        helperText={registerErrors.name}
                      />

                      <TextField
                        id="outlined-basic"
                        type="email"
                        label="Email address"
                        variant="outlined"
                        className="w-100 mt-2"
                        value={registerFields.email}
                        onChange={(e) => {
                          setRegisterField({
                            ...registerFields,
                            email: e.target.value,
                          });
                          setRegisterError((prevState) => ({
                            ...prevState,
                            email: "",
                          }));
                        }}
                        error={registerErrors.email}
                        helperText={registerErrors.email}
                      />

                      <TextField
                        id="outlined-basic"
                        type="tel"
                        label="Mobile number"
                        variant="outlined"
                        className="w-100 mt-2"
                        value={registerFields.phone}
                        onChange={(e) => {
                          setRegisterField({
                            ...registerFields,
                            phone: e.target.value,
                          });
                          setRegisterError((prevState) => ({
                            ...prevState,
                            phone: "",
                          }));
                        }}
                        error={registerErrors.phone}
                        helperText={registerErrors.phone}
                        autoComplete="off"
                      />

                      <TextField
                        id="outlined-basic"
                        type="password"
                        label="Password"
                        variant="outlined"
                        className="w-100 mt-2"
                        value={registerFields.password}
                        onChange={(e) => {
                          setRegisterField({
                            ...registerFields,
                            password: e.target.value,
                          });
                          setRegisterError((prevState) => ({
                            ...prevState,
                            password: "",
                          }));
                        }}
                        error={registerErrors.password}
                        helperText={registerErrors.password}
                      />

                      {!authUser.signUpLoading ? (
                        <input
                          type="button"
                          className="login-button mt-2"
                          style={{ width: "100%" }}
                          value="Register"
                          onClick={() => {
                            handleRegister();
                          }}
                        />
                      ) : (
                        <>
                          <p className="user-sign-loading content-center mt-4">
                            <CircularProgress
                              size={25}
                              color="success"
                              className="me-2"
                            />
                            Joining the biggest Network
                          </p>
                        </>
                      )}

                      <div className="login-line"></div>
                    </div>
                  </div>
                  <div className="register-button align-self-center mt-4">
                    <span className="justify-content-center me-2">
                      Already have an account?
                    </span>
                    <span
                      style={{ color: "#C77514", cursor: "pointer" }}
                      onClick={() => setToggle(true)}
                    >
                      Login
                    </span>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Login;
