import React, { useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Homepage from "./Pages/Homepage/Homepage";
import ViewNews from "./Pages/ViewNews/ViewNews";
import Addnews from "./Pages/Creator/Addnews/Addnews";
import CreateChannel from "./Pages/Creator/CreateChannel/CreateChannel";
import Cookies from "js-cookie";
import "./App.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import Creator from "./Pages/Creator/Creator";
import { useSelector, useDispatch } from "react-redux";
import { signOut, verifyUser } from "./actions/userActions";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authUser);

  // useEffect(()=>{
  //   // console.log("from app");
  //   // let user = localStorage.getItem("userInfo")
  //   if(authData){
  //     // dispatch(verifyUser());
  //   }
  // },[dispatch])

  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/post/:id" element={<ViewNews />} />

          <Route exact path="/creator">
            <Route
              exact
              path="register"
              element={
                authData.user !== null ? (
                  <CreateChannel />
                ) : (
                  <Homepage response={"Login first"} />
                )
              }
            />
            <Route
              exact
              path="add"
              element={
                authData.user !== null ? (
                  <Creator children={<Addnews />} />
                ) : (
                  <Homepage response={"Login first"} />
                )
              }
            />
          </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
