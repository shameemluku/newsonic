import * as api from "../api";
import {
  REQUEST_POST_DETAILS,
  FULL_POST_DETAILS,
  REQUEST_COMMENT,
  UPDATE_LIKE,
  UPDATE_SAVE,
  REQUEST_DELETE_POSTS,
  DELETE_POSTS_SUCCESS,
  DELETE_POSTS_FAILED,
  COMMENT_SUCCESS,
  REQUEST_DELETE_COMMENT,
  DELETE_COMMENT_SUCCESS,
  POST_DETAILS_FAILED,
} from "../constants/actionTypes";
import { generateSignature } from "../utility/fingerprint";

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchHomeData();
    dispatch({
      type: "FETCH_ALL",
      payload: data.posts,
    });

    delete data.posts;
    delete data.status;

    dispatch({
      type: "SET_CATEGORY_POSTS",
      payload: data,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post, setProgress, progress) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post, setProgress, progress);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveDraft = async (post) => {
  try {
    const { data } = await api.saveDraft(post);
    if (data.status) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

export const getPostDetails = (postId,setNotFound) => async (dispatch, getState) => {
  try {
    const { authUser } = getState();

    dispatch({
      type: REQUEST_POST_DETAILS,
    });
    const { data } = await api.fetchPostDetails(
      postId,
      await generateSignature()
    );

    dispatch({
      type: FULL_POST_DETAILS,
      payload: data.post_details,
    });
  } catch (error) {
    if(error.response.data?.type==='POST_ERROR'){
      setNotFound(true)
      dispatch({
        type: POST_DETAILS_FAILED,
      })
    }

  }
};

export const postComment =
  (commentData, setEmpty) => async (dispatch, useState) => {
    try {
      const { selectedPost, authUser } = useState();

      dispatch({
        type: REQUEST_COMMENT,
      });

      const { data } = await api.postComment(commentData);

      if (data.status) {
        data.comment.username = authUser.user.name;
        data.comment.userImage = authUser.user.image;
        selectedPost.details.comments.push(data.comment);
        setEmpty("");
        dispatch({
          type: COMMENT_SUCCESS,
          payload: selectedPost.details,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

export const deleteComment = (comment) => async (dispatch, useState) => {
  try {
    const { selectedPost } = useState();

    dispatch({
      type: REQUEST_DELETE_COMMENT,
    });

    const { data } = await api.deleteComment({
      commentId: comment.commentId,
      postId: selectedPost.details._id,
    });

    if (data.status) {
      selectedPost.details.comments.pop(comment);

      dispatch({
        type: DELETE_COMMENT_SUCCESS,
        payload: selectedPost.details,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const likePost = (likeData, current) => async (dispatch) => {
  try {
    current.likes = current.isLiked ? --current.likes : ++current.likes;
    current.isLiked = !current.isLiked;

    dispatch({
      type: UPDATE_LIKE,
      payload: current,
    });
    let { data } = await api.likePost(likeData);
  } catch (error) {
    current.likes = current.isLiked ? --current.likes : ++current.likes;
    current.isLiked = !current.isLiked;
    dispatch({
      type: UPDATE_LIKE,
      payload: current,
    });
  }
};

export const savePost = (saveData, current) => async (dispatch) => {
  try {
    if (current) current.isSaved = !current.isSaved;
    dispatch({
      type: UPDATE_SAVE,
      payload: current,
    });
    let { data } = await api.savePost(saveData);
  } catch (error) {
    if (current) current.isSaved = !current.isSaved;
    dispatch({
      type: UPDATE_SAVE,
      payload: current,
    });
  }
};

export const deletePost =
  (deleteIDs, deleteImages, channelId, setStatus) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "SHOW_PROGRESS" });
      const { addedPosts } = getState();
      dispatch({
        type: REQUEST_DELETE_POSTS,
      });

      let { data } = await api.deletePost(
        { deleteIDs, deleteImages },
        channelId
      );
      if (data.status) {
        let afterDelete = addedPosts.posts.filter((post) => {
          if (!deleteIDs.includes(post._id)) return post;
        });
        setStatus("SUCCESS");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: DELETE_POSTS_SUCCESS,
          payload: afterDelete,
        });
      } else {
        setStatus("FAILED");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: DELETE_POSTS_FAILED,
        });
      }
    } catch (error) {
      setStatus("FAILED");
      dispatch({ type: "HIDE_PROGRESS" });
      dispatch({
        type: DELETE_POSTS_FAILED,
      });
    }
  };

export const deleteDraft =
  (deleteIDs, channelId, setStatus) => async (dispatch, getState) => {
    try {
      dispatch({ type: "SHOW_PROGRESS" });
      const { addedPosts } = getState();
      dispatch({
        type: REQUEST_DELETE_POSTS,
      });

      let { data } = await api.deleteDraft({ deleteIDs }, channelId);
      if (data.status) {
        let afterDelete = addedPosts.posts.filter((post) => {
          if (!deleteIDs.includes(post._id)) return post;
        });
        setStatus("SUCCESS");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: DELETE_POSTS_SUCCESS,
          payload: afterDelete,
        });
      } else {
        setStatus("FAILED");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: DELETE_POSTS_FAILED,
        });
      }
    } catch (err) {
      setStatus("FAILED");
      dispatch({ type: "HIDE_PROGRESS" });
      dispatch({
        type: DELETE_POSTS_FAILED,
      });
    }
  };

export const translateText = (text, lang) => {
  return new Promise(async (res, rej) => {
    let { data } = await api.translate(text, lang);
    res(data?.translation);
  });
};
