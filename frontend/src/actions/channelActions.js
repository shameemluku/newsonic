import * as api from "../api";
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
  FAILED_SELECTED_POST,
  SUCCESS_SELECTED_POST,
  FETCH_SELECTED_POST,
} from "../constants/actionTypes";

export const createChannel =
  (channelData, setProgress, navigate) => async (dispatch) => {
    try {
      dispatch({
        type: CREATE_CHANNEL_REQUEST,
      });

      const { data } = await api.createChannel(channelData, setProgress);

      if (data.status) {
        dispatch({
          type: CREATE_CHANNEL_SUCCESS,
          payload: data.details,
        });
        navigate("/creator/add");
      } else {
        dispatch({
          type: CREATE_CHANNEL_FAILED,
        });
      }
    } catch (error) {
      dispatch({
        type: CREATE_CHANNEL_FAILED,
      });
    }
  };

export const getChannelDetails = () => async (dispatch) => {
  try {
    dispatch({
      type: REQUEST_CHANNEL_DETAILS,
    });

    const { data } = await api.getChannelDetails();
    if (data) {
      dispatch({
        type: GET_CHANNEL_DETAILS,
        payload: data.channelDetails,
      });
    }
  } catch (error) {
    dispatch({
      type: CHANNEL_DETAILS_FAILURE,
    });
  }
};

export const getCreatorPosts =
  (channelId, filter, limit) => async (dispatch) => {
    try {
      dispatch({
        type: REQUEST_ADDED_POSTS,
      });

      let added_posts = await api.getAddedPosts(channelId, filter, limit);

      if (added_posts) {
        dispatch({
          type: ADDED_POSTS_SUCCESS,
          payload: added_posts.data,
        });
      }
    } catch (error) {}
  };

export const getFullDetails = (postId) => async (dispatch, getState) => {
  try {
    const { channel } = getState().channelDetails;
    const { data } = await api.creatorPostDetails(postId, channel?._id);

    if (data.status) {
      dispatch({
        type: SUCCESS_SELECTED_POST,
        loading: false,
        payload: data.post,
      });
    } else {
      dispatch({
        type: FAILED_SELECTED_POST,
        loading: false,
      });
    }
  } catch (error) {
    dispatch({
      type: FAILED_SELECTED_POST,
      loading: false,
    });
  }
};

export const updatePostText =
  (data, showToast) => async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_SELECTED_POST,
      });

      const { post } = getState().creatorSelectedPost;
      const { channel } = getState().channelDetails;
      const { _id: channelId } = channel;

      let response = await api.updatePostText(data, channelId);
      if (response) {
        post.newsHead = data.title;
        post.newsBody = data.body;
        showToast("Post data updated!", "success");
        dispatch({
          type: SUCCESS_SELECTED_POST,
          payload: post,
        });
      } else {
        showToast("Updation Failed", "error");
        dispatch({
          type: FAILED_SELECTED_POST,
        });
      }
    } catch (error) {
      showToast("Updation Failed", "error");
      dispatch({
        type: FAILED_SELECTED_POST,
      });
    }
  };

export const updatePostCategory =
  (data, showToast) => async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_SELECTED_POST,
      });

      const { post } = getState().creatorSelectedPost;
      const { channel } = getState().channelDetails;
      const { _id: channelId } = channel;

      let response = await api.updatePostCategory(data, channelId);
      if (response) {
        showToast("Category updated!", "success");
        post.category = data.category;
        dispatch({
          type: SUCCESS_SELECTED_POST,
          payload: post,
        });
      } else {
        showToast("Updation Failed", "error");
        dispatch({
          type: FAILED_SELECTED_POST,
        });
      }
    } catch (error) {
      showToast("Updation Failed", "error");
      dispatch({
        type: FAILED_SELECTED_POST,
      });
    }
  };

export const updatePostIsComment =
  (data, showToast) => async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_SELECTED_POST,
      });

      const { post } = getState().creatorSelectedPost;
      const { channel } = getState().channelDetails;
      const { _id: channelId } = channel;

      let response = await api.updatePostIsComment(data, channelId);
      if (response) {
        showToast("Comment status updated!", "success");
        post.isComment = data.isComment;
        dispatch({
          type: SUCCESS_SELECTED_POST,
          payload: post,
        });
      } else {
        showToast("Updation Failed", "error");
        dispatch({
          type: FAILED_SELECTED_POST,
        });
      }
    } catch (error) {
      showToast("Updation Failed", "error");
      dispatch({
        type: FAILED_SELECTED_POST,
      });
    }
  };

export const updatePostIsMonetize =
  (data, showToast) => async (dispatch, getState) => {
    try {
      dispatch({
        type: FETCH_SELECTED_POST,
      });

      const { post } = getState().creatorSelectedPost;
      const { channel } = getState().channelDetails;
      const { _id: channelId } = channel;

      let response = await api.updatePostIsMonetize(data, channelId);
      if (response) {
        post.isMonetize = data.isMonetize;
        dispatch({
          type: SUCCESS_SELECTED_POST,
          payload: post,
        });
        showToast("Monetization status changed!", "success");
      } else {
        dispatch({
          type: FAILED_SELECTED_POST,
        });
        showToast("Updation Failed", "error");
      }
    } catch (error) {
      dispatch({
        type: FAILED_SELECTED_POST,
      });
      showToast("Updation Failed", "error");
    }
  };

export const updateChannelData =
  (data, showToast, setEnableEdit) => async (dispatch, getState) => {
    try {
      dispatch({ type: "SHOW_PROGRESS" });
      dispatch({
        type: REQUEST_CHANNEL_DETAILS,
      });

      const { channelDetails } = getState();
      const { _id: channelId } = channelDetails.channel;
      let { data: response } = await api.updateChannel(data, channelId);

      if (response.status) {
        setEnableEdit(false);
        channelDetails.channel = { ...channelDetails.channel, ...data };
        showToast(response.message, "success");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: GET_CHANNEL_DETAILS,
          payload: channelDetails.channel,
        });
      } else {
        throw "Something went wrong";
      }
    } catch (error) {
      showToast("Updating data failed!", "error");
      dispatch({ type: "HIDE_PROGRESS" });
      dispatch({
        type: CHANNEL_DETAILS_FAILURE,
      });
    }
  };

export const updateChannelImage =
  (data, showToast, setEnableEdit) => async (dispatch, getState) => {
    try {
      dispatch({ type: "SHOW_PROGRESS" });
      dispatch({
        type: REQUEST_CHANNEL_DETAILS,
      });

      const { channelDetails } = getState();
      const { _id: channelId } = channelDetails.channel;
      let { data: response } = await api.updateChannelImage(data, channelId);

      if (response.status) {
        setEnableEdit(false);
        showToast(response.message, "success");
        dispatch({ type: "HIDE_PROGRESS" });
        dispatch({
          type: GET_CHANNEL_DETAILS,
          payload: channelDetails.channel,
        });
      } else {
        throw "Something went wrong";
      }
    } catch (error) {
      showToast("Updating data failed!", "error");
      dispatch({ type: "HIDE_PROGRESS" });
      dispatch({
        type: CHANNEL_DETAILS_FAILURE,
      });
    }
  };
