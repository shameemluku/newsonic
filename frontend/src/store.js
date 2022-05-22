import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import { posts, categoryPosts, selectedPost } from "./reducers/postReducers";

import { authReducer, showLoginModal } from "./reducers/userAuthReducers";

import { createChannel, channelDetails, addedPosts } from "./reducers/channelReducer";

const reducers = combineReducers({
  posts,
  catPosts:categoryPosts,
  authUser: authReducer,
  loginModal: showLoginModal,
  channelCreate: createChannel,
  channelDetails,
  selectedPost,
  addedPosts
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
