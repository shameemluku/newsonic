import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  posts,
  categoryPosts,
  selectedPost,
  selectedDraft,
} from "./reducers/postReducers";

import { authReducer, showLoginModal } from "./reducers/userAuthReducers";

import {
  createChannel,
  channelDetails,
  addedPosts,
  creatorSelectedPost,
} from "./reducers/channelReducer";

import { sponsorDetails } from "./reducers/adReducer";
import { showTopProgress } from "./reducers/progressReducer";

import { adminDetails, showAdminProgress } from "./reducers/adminReducers";

const reducers = combineReducers({
  posts,
  catPosts: categoryPosts,
  authUser: authReducer,
  loginModal: showLoginModal,
  channelCreate: createChannel,
  channelDetails,
  selectedPost,
  selectedDraft,
  addedPosts,
  sponsorDetails,
  creatorSelectedPost,
  showTopProgress,
  adminDetails,
  showAdminProgress,
});

const store = createStore(
  reducers,
  process.env.REACT_APP_MODE === "DEVELOPMENT"
    ? composeWithDevTools(applyMiddleware(thunk))
    : compose(applyMiddleware(thunk))
);

export default store;
