import React, { useEffect, useState } from "react";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Homepage from "./Pages/Homepage/Homepage";
import ViewNews from "./Pages/ViewNews/ViewNews";
import Addnews from "./Pages/Creator/Addnews/Addnews";
import CreateChannel from "./Pages/Creator/CreateChannel/CreateChannel";
import Cookies from "js-cookie";

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
import Dashboard from "./Pages/Creator/Dashboard/Dashboard";
import Posts from "./Pages/Creator/Posts/Posts";
import { getUserIp } from "./api";
import {generateSignature} from "./utility/fingerprint"
import CategoryPage from "./Pages/Category/CategoryPage";

function App() {

  const user = useSelector((state) => state.authUser.user);
  const {showSnackbar} = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar()

  useEffect(()=>{
    // enqueueSnackbar("Welcome", { variant: "error" })
    // generateSignature()
  },[])

  return (
    
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/post/:id" element={<ViewNews />} />
          <Route exact path="category/:category" element={<CategoryPage/>} />

          <Route exact path="/creator">
            <Route path="register" element={ user ? <CreateChannel /> : <Homepage response={true} />}/>
            <Route path="" element={ user ? <Creator children={<Dashboard/>} active='analytics'/> : <Homepage response={true} />}/>
            <Route path="posts" element={ user ? <Creator children={<Posts/>} active='posts'/> : <Homepage response={true} />}/>
            <Route path="add" element={ user ? <Creator children={<Addnews />} /> : <Homepage response={true} />}/>
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
