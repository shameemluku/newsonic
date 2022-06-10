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
import CreateAd from "./Pages/Sponsor/CreateAd/CreateAd";
import Saved from "./Pages/Saved/Saved";
import SponsorHome from "./Pages/Sponsor/Home/SponsorHome";
import SponsorDashboard from "./Pages/Sponsor/Dashboard/Dashboard";
import PostDetails from "./Pages/Creator/PostDetails/PostDetails";
import TopProgress from "./components/Elements/TopProgress";
import Transactions from "./Pages/Creator/Transactions/Transactions";
import ChannelSettings from "./Pages/Creator/ChannelSettings/ChannelSettings";

import Login from "./Pages/Admin/Login";
import Layout from "./Pages/Admin/Layout";
import AdminPosts from "./Pages/Admin/Childrens/Posts";
import Users from "./Pages/Admin/Childrens/Users";
import AdminPostDetails from "./Pages/Admin/Childrens/PostDetails";
import ChannelsList from "./Pages/Admin/Childrens/Channels";
import AdList from "./Pages/Admin/Childrens/AdList";
import Payouts from "./Pages/Admin/Childrens/Payouts";
import AdminDashboard from "./Pages/Admin/Childrens/Dashboard";
import Profile from "./Pages/Profile/Profile";

function App() {

  const user = useSelector((state) => state.authUser.user);
  const admin = useSelector((state) => state.adminDetails.user);
  const {showTopProgress} = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar()

  return (
    
    <>
    
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/post/:id" element={<ViewNews />} />
          <Route exact path="category/:category" element={<CategoryPage/>} />  
          <Route exact path="/post/saved" element={<Saved/>} />
          <Route exact path="/profile" element={user ? <Profile/> : <Homepage response={true}/> } />

          <Route exact path="/creator">
            <Route path="register" element={ user ? <CreateChannel /> : <Homepage response={true} />}/>
            <Route path="" element={ user ? <Creator children={<Dashboard/>} active='analytics'/> : <Homepage response={true} />}/>
            <Route path="posts" element={ user ? <Creator children={<Posts/>} active='posts'/> : <Homepage response={true} />}/>
            <Route path="transactions" element={ user ? <Creator children={<Transactions />} active='transactions'/> : <Homepage response={true} />}/>
            <Route path="add" element={ user ? <Creator children={<Addnews />} /> : <Homepage response={true} />}/>
            <Route path="post/:id" element={ user ? <Creator children={<PostDetails />} /> : <Homepage response={true} />}/>
            <Route path="settings" element={ user ? <Creator children={<ChannelSettings />} active='settings'/> : <Homepage response={true} />}/>
          </Route>


          <Route exact path="/sponsor">
            <Route path="" element={ <SponsorHome/> }/>
            <Route path="create" element={ user ? <CreateAd/> : <SponsorHome/> }/>
            <Route path="dashboard" element={ user ? <SponsorDashboard/> : <SponsorHome/> }/>
          </Route>


          <Route exact path="/admin">
            <Route path="" element={ admin ? <Layout children={<AdminDashboard/>}/> : <Login/> }/>
            <Route path="posts" element={ admin ? <Layout children={<AdminPosts/>}  active='posts'/> : <Login/> }/>
            <Route path="users" element={ admin ? <Layout children={<Users/>} active='users'/> : <Login/> }/>
            <Route path="post/:id" element={ admin ? <Layout children={<AdminPostDetails/>}/> : <Login/> }/>
            <Route path="channels" element={ admin ? <Layout children={<ChannelsList/>} active='channels'/> : <Login/> }/>
            <Route path="ads" element={ admin ? <Layout children={<AdList/>} active='ads'/> : <Login/> }/>
            <Route path="payouts" element={ admin ? <Layout children={<Payouts/>} active='payouts'/> : <Login/> }/>
          </Route>


        </Routes>
      </Router>

      {showTopProgress && <TopProgress/>}
      
    </>
  );
}

export default App;
