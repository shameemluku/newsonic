import {
  CREATE_CHANNEL_SUCCESS,
  CREATE_CHANNEL_REQUEST,
  CREATE_CHANNEL_FAILED,
  GET_CHANNEL_DETAILS,
  REQUEST_CHANNEL_DETAILS,
  CHANNEL_DETAILS_FAILURE,
  REQUEST_ADDED_POSTS,
  ADDED_POSTS_SUCCESS,
  ADDED_POSTS_FAILED,
  REQUEST_DELETE_POSTS,
  DELETE_POSTS_SUCCESS,
  DELETE_POSTS_FAILED,
  FAILED_SELECTED_POST,
  SUCCESS_SELECTED_POST,
  FETCH_SELECTED_POST,
  SET_SELECTED_POST,
} from "../constants/actionTypes";

let initalState = {
  channel: null,
  loading: false,
};
export const createChannel = (state = initalState, action) => {
  switch (action.type) {
    case CREATE_CHANNEL_REQUEST:
      return { ...state, loading: true };

    case CREATE_CHANNEL_FAILED:
      return {
        ...state,
        success: false,
        loading: false,
      };

    case CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        channel: action.payload,
      };

    default:
      return state;
  }
};

export const channelDetails = (
  state = { channel: null, loading: false },
  action
) => {
  switch (action.type) {
    case REQUEST_CHANNEL_DETAILS:
      return {
        ...state,
        loading: true,
      };
    case GET_CHANNEL_DETAILS:
      return {
        ...state,
        loading: false,
        channel: action.payload,
      };

    case CHANNEL_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export const addedPosts = (
  state = {
    posts: [],
    loading: false,
    isDeleting: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_ADDED_POSTS:
      return {
        ...state,
        loading: true,
      };
    case ADDED_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload?.posts,
      };

    case ADDED_POSTS_FAILED:
      return {
        ...state,
        loading: false,
      };

    case REQUEST_DELETE_POSTS:
      return {
        ...state,
        isDeleting: true,
      };
    case DELETE_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        isDeleting: false,
      };
    case DELETE_POSTS_FAILED:
      return {
        ...state,
        isDeleting: false,
      };
    default:
      return state;
  }
};

export const creatorSelectedPost = (
  state = {
    post: null,
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case FETCH_SELECTED_POST:
      return {
        ...state,
        loading: true,
      };

    case SET_SELECTED_POST:
      return {
        ...state,
        post: action.payload,
      };

    case SUCCESS_SELECTED_POST:
      return {
        ...state,
        post: action.payload,
        loading: false,
      };

    case FAILED_SELECTED_POST:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};
