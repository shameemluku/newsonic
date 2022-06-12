import * as api from "../api";
import {
  USER_SIGNUP,
  USER_SIGNIN,
  USER_VERIFIED,
  USER_SIGNOUT,
  GET_CHANNEL_DETAILS,
  USER_SIGNIN_LOAD,
  USER_LOAD_END,
  USER_SIGNUP_LOAD,
} from "../constants/actionTypes";

export const signUp = (params) => async (dispatch) => {
  const {
    registerFields: formData,
    setResponse,
    response,
    hideModal,
    setRegisterField,
  } = params;

  try {
    dispatch({ type: "SHOW_PROGRESS" });
    dispatch({ type: USER_SIGNUP_LOAD });
    const { data } = await api.signUp(formData);
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({
      type: USER_SIGNUP,
      payload: data.user,
    });
    setRegisterField && setRegisterField({});
    dispatch({ type: "CLOSE_MODAL" });
    hideModal();
  } catch (error) {
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({ type: USER_LOAD_END });
    let message = error.response?.data?.message
      ? error.response?.data?.message
      : "Something wrong. Please check your network";
    setResponse({ ...response, status: true, message });
  }
};

export const signIn = (params) => async (dispatch) => {
  const {
    loginFields: formData,
    setResponse,
    response,
    hideModal,
    setLoginField,
  } = params;

  try {
    dispatch({ type: "SHOW_PROGRESS" });
    dispatch({ type: USER_SIGNIN_LOAD });
    const { data } = await api.signIn(formData);
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({
      type: USER_SIGNIN,
      payload: data.user,
    });

    setLoginField({});
    dispatch({ type: "CLOSE_MODAL" });
    hideModal();
  } catch (error) {
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({ type: USER_LOAD_END });
    let message = error.response?.data?.message
      ? error.response?.data?.message
      : "Something wrong. Please check your network";
    setResponse({ ...response, status: true, message });
  }
};

export const signOut = () => async (dispatch) => {
  try {
    dispatch({ type: "SHOW_PROGRESS" });
    const { status } = await api.signOut();
    dispatch({ type: "HIDE_PROGRESS" });
    if (status === 200) {
      dispatch({
        type: GET_CHANNEL_DETAILS,
        payload: null,
      });
      dispatch({ type: USER_SIGNOUT });
    }
  } catch (error) {
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({ type: USER_LOAD_END });
  }
};

export const verifyUser = () => async (dispatch, getState) => {
  const data = await api.verifyUser();
  if (data.status === 200) {
    dispatch({
      type: USER_VERIFIED,
      payload: data.data.user,
    });
  }
};

export const changeDp = async (image) => {
  try {
    const { data } = await api.changeDp({ image });
    if (data.status) {
      return data;
    }
  } catch (error) {
    return { status: false };
  }
};

export const removeDp = async () => {
  try {
    const { data } = await api.removeDp();
    if (data.status) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const changeName = async (name) => {
  try {
    const { data } = await api.changeName({ name });
    if (data.status) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const changePhone = async (phone) => {
  try {
    const { data } = await api.changePhone({ phone });
    if (data.status) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const changePassword = async (passwords) => {
  try {
    const { data } = await api.changePassword(passwords);
    if (data.status) {
      return { status: true };
    }
  } catch (error) {
    return { status: false, message: error.response?.data?.message };
  }
};

export const getUserProfile = async () => {
  try {
    const { data } = await api.fetchUserProfile();
    if (data.status) {
      return data;
    }
  } catch (error) {
    return { status: false };
  }
};
