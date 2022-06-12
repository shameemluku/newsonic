import React, { useEffect, useState, Suspense } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

import {
   useSelector, 
   useDispatch 
} from "react-redux";

import { 
  SnackbarProvider, 
  VariantType, useSnackbar 
} from "notistack";

//Utilities and Components
import { generateSignature } from "./utility/fingerprint"

const TopProgress = React.lazy(()=> import("./components/Elements/TopProgress"));
const Loader = React.lazy(()=> import("./components/Loader/Loader"));
const ErrorPage = React.lazy(()=> import("./Pages/ErrorPage/ErrorPage"));

// Pages

//Homepage
const Homepage = React.lazy(()=> import("./Pages/Homepage/Homepage"));
const ViewNews = React.lazy(()=> import("./Pages/ViewNews/ViewNews"));
const CategoryPage = React.lazy(()=> import("./Pages/Category/CategoryPage"));
const Saved = React.lazy(()=> import("./Pages/Saved/Saved"));
const Profile = React.lazy(()=> import("./Pages/Profile/Profile"));

//Sponsor
const CreateAd = React.lazy(()=> import("./Pages/Sponsor/CreateAd/CreateAd"));
const SponsorHome = React.lazy(()=> import("./Pages/Sponsor/Home/SponsorHome"));
const SponsorDashboard = React.lazy(()=> import("./Pages/Sponsor/Dashboard/Dashboard"));

//Creator
const Addnews = React.lazy(()=> import("./Pages/Creator/Addnews/Addnews"));
const CreateChannel = React.lazy(()=> import("./Pages/Creator/CreateChannel/CreateChannel"));
const PostDetails = React.lazy(()=> import("./Pages/Creator/PostDetails/PostDetails"));
const Transactions = React.lazy(()=> import("./Pages/Creator/Transactions/Transactions"));
const ChannelSettings = React.lazy(()=> import("./Pages/Creator/ChannelSettings/ChannelSettings"));
const Dashboard = React.lazy(()=> import("./Pages/Creator/Dashboard/Dashboard"));
const Posts = React.lazy(()=> import("./Pages/Creator/Posts/Posts"));
const Creator = React.lazy(()=> import("./Pages/Creator/Creator"));

//Admin
const Login = React.lazy(()=> import("./Pages/Admin/Login"));
const Layout = React.lazy(()=> import("./Pages/Admin/Layout"));
const AdminPosts = React.lazy(()=> import("./Pages/Admin/Childrens/Posts"));
const Users = React.lazy(()=> import("./Pages/Admin/Childrens/Users"));
const AdminPostDetails = React.lazy(()=> import("./Pages/Admin/Childrens/PostDetails"));
const ChannelsList = React.lazy(()=> import("./Pages/Admin/Childrens/Channels"));
const AdList = React.lazy(()=> import("./Pages/Admin/Childrens/AdList"));
const Payouts = React.lazy(()=> import("./Pages/Admin/Childrens/Payouts"));
const AdminDashboard = React.lazy(()=> import("./Pages/Admin/Childrens/Dashboard"));


function App() {

  const user = useSelector((state) => state.authUser.user);
  const admin = useSelector((state) => state.adminDetails.user);
  const {showTopProgress} = useSelector((state) => state);
  const { enqueueSnackbar } = useSnackbar()

  return (
    
    <>
    <Suspense fallback={<Loader />}>
      <Router>
        <Routes>

          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/post/:id" element={<ViewNews />} />
          <Route exact path="category/:category" element={<CategoryPage/>} />  
          <Route exact path="/post/saved" element={<Saved/>} />
          <Route exact path="/profile" element={user 
            ? <Profile/> 
            : <Homepage response={true}/> } />

          <Route exact path="/creator">
            <Route path="register" element={ user 
              ? <CreateChannel /> 
              : <Homepage response={true} />}/>
            <Route path="" element={ user 
              ? <Creator children={<Dashboard/>} active='analytics'/> 
              : <Homepage response={true} />}/>
            <Route path="posts" element={ user 
              ? <Creator children={<Posts/>} active='posts'/> 
              : <Homepage response={true} />}/>
            <Route path="transactions" element={ user 
              ? <Creator children={<Transactions />} active='transactions'/> 
              : <Homepage response={true} />}/>
            <Route path="add" element={ user 
              ? <Creator children={<Addnews />} /> 
              : <Homepage response={true} />}/>
            <Route path="post/:id" element={ user 
              ? <Creator children={<PostDetails />} /> 
              : <Homepage response={true} />}/>
            <Route path="settings" element={ user 
              ? <Creator children={<ChannelSettings />} active='settings'/> 
              : <Homepage response={true} />}/>
          </Route>


          <Route exact path="/sponsor">
            <Route path="" element={ <SponsorHome/> }/>
            <Route path="create" element={ user 
              ? <CreateAd/> 
              : <SponsorHome/> }/>
            <Route path="dashboard" element={ user 
              ? <SponsorDashboard/> 
              : <SponsorHome/> }/>
          </Route>


          <Route exact path="/admin">
            <Route path="" element={ admin 
              ? <Layout children={<AdminDashboard/>}/> 
              : <Login/> }/>
            <Route path="posts" element={ admin 
              ? <Layout children={<AdminPosts/>}  active='posts'/> 
              : <Login/> }/>
            <Route path="users" element={ admin 
              ? <Layout children={<Users/>} active='users'/> 
              : <Login/> }/>
            <Route path="post/:id" element={ admin 
              ? <Layout children={<AdminPostDetails/>}/> 
              : <Login/> }/>
            <Route path="channels" element={ admin 
              ? <Layout children={<ChannelsList/>} active='channels'/> 
              : <Login/> }/>
            <Route path="ads" element={ admin 
              ? <Layout children={<AdList/>} active='ads'/> 
              : <Login/> }/>
            <Route path="payouts" element={ admin 
              ? <Layout children={<Payouts/>} active='payouts'/> 
              : <Login/> }/>
          </Route>


          <Route exact path="*" element={<ErrorPage/>}></Route>

        </Routes>
      </Router>

      {showTopProgress && <TopProgress/>}

    </Suspense>
    </>
  );
}

export default App;
