import React, { useEffect, useState } from "react";
import logo from "../../Images/mainlogo.svg";
import avathar from "../../Images/default.svg";
import "./Admin.css";
import { Button, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { signIn } from "../../actions/adminActions";
import { VariantType, useSnackbar } from "notistack";

function Login() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [response, setResponse] = useState({ status: false, message: "" });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    dispatch(signIn(loginData,setResponse));
  };

  useEffect(() => {
    if (response.status) {
      enqueueSnackbar(response.message, { variant: "error" });
    }
  }, [response]);

  return (
    <div className="wrapper">
      <div className="login-card">
        <div className="center">
          <div>Admin</div>
          <img src={logo} alt="" className="creator-logo"></img>
        </div>
        <div>
          <p className="content-center mt-5 mb-0 f-20">Welcome Back!</p>
          <p className="content-center f-15 mb-5">
            Sign in to your account to continue
          </p>
        </div>
        <div className="content-center">
          <img
            className="admin-avatar"
            src={avathar}
            alt=""
            draggable="false"
          />
        </div>
        <div className="w-100 mt-5">
          <TextField
            className="w-100"
            id="outlined-basic"
            label="Email"
            autoComplete="email"
            variant="outlined"
            value={loginData.email}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <TextField
            className="w-100 mt-3"
            id="outlined-basic"
            label="Password"
            type={"password"}
            variant="outlined"
            value={loginData.password}
            onChange={(e) =>
              setLoginData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <Button
            className="admin-login-btn w-100 mt-3"
            variant="contained"
            onClick={handleLogin}
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
