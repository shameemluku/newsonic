import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import { posts, categoryPosts, selectedPost } from "./reducers/postReducers";
import { authReducer, showLoginModal } from "./reducers/userAuthReducers";
import { createChannel, channelDetails, addedPosts, creatorSelectedPost } from "./reducers/channelReducer";
import { sponsorDetails } from "./reducers/adReducer";
import { showTopProgress } from "./reducers/progressReducer";

const reducers = combineReducers({
  posts,
  catPosts:categoryPosts,
  authUser: authReducer,
  loginModal: showLoginModal,
  channelCreate: createChannel,
  channelDetails,
  selectedPost,
  addedPosts,
  sponsorDetails,
  creatorSelectedPost,
  showTopProgress
});

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);


// const store = createStore(reducers, compose(applyMiddleware(thunk)))

export default store;
