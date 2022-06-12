import {
  REQUEST_POST_DETAILS,
  POST_DETAILS_FAILED,
  CLEAR_POST_DETAILS,
  SET_POST_DETAILS,
  FULL_POST_DETAILS,
  UPDATE_LIKE,
  REQUEST_COMMENT,
  COMMENT_SUCCESS,
  COMMENT_FAILED,
  UPDATE_SAVE,
  DELETE_COMMENT_SUCCESS,
  REQUEST_DELETE_COMMENT,
  DELETE_COMMENT_FAILED,
  CLEAR_SELECTED_DRAFT,
  SET_SELECTED_DRAFT,
} from "../constants/actionTypes";

export const posts = (posts = [], action) => {
  switch (action.type) {
    case "FETCH_ALL":
      return action.payload;
    case "CREATE":
      return posts;
    default:
      return posts;
  }
};

export const categoryPosts = (posts = {}, action) => {
  switch (action.type) {
    case "SET_CATEGORY_POSTS":
      return action.payload;

    default:
      return posts;
  }
};

export const selectedPost = (
  posts = {
    details: {},
    loading: false,
    commentLoading: false,
    deleteComment: false,
  },
  action
) => {
  switch (action.type) {
    case SET_POST_DETAILS:
      return {
        ...posts,
        details: action.payload,
      };

    case REQUEST_POST_DETAILS:
      return {
        ...posts,
        loading: true,
      };
    case FULL_POST_DETAILS:
      return {
        ...posts,
        details: action?.payload[0],
        loading: false,
      };

    case POST_DETAILS_FAILED:
      return {
        ...posts,
        loading: false,
      };

    case CLEAR_POST_DETAILS:
      return {
        ...posts,
        details: {},
        loading: false,
      };

    case UPDATE_LIKE:
      return {
        ...posts,
        details: action.payload,
      };

    case UPDATE_SAVE:
      return {
        ...posts,
        details: action.payload,
      };

    case REQUEST_COMMENT:
      return {
        ...posts,
        commentLoading: true,
      };

    case COMMENT_SUCCESS:
      return {
        ...posts,
        details: action.payload,
        commentLoading: false,
      };

    case COMMENT_FAILED:
      return {
        ...posts,
        commentLoading: false,
      };

    case REQUEST_DELETE_COMMENT:
      return {
        ...posts,
        deleteComment: true,
      };

    case DELETE_COMMENT_SUCCESS:
      return {
        ...posts,
        details: action.payload,
        deleteComment: false,
      };

    case DELETE_COMMENT_FAILED:
      return {
        ...posts,
        deleteComment: false,
      };

    default:
      return posts;
  }
};

export const selectedDraft = (draft = null, action) => {
  switch (action.type) {
    case SET_SELECTED_DRAFT:
      return {
        ...action.payload,
      };
    case CLEAR_SELECTED_DRAFT:
      return null;
    default:
      return draft;
  }
};
