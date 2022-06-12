import * as api from "../api/admin";
import {
  ADMIN_SIGNIN,
  ADMIN_SIGNOUT,
  ADMIN_VERIFIED,
} from "../constants/actionTypes";

export const signIn = (loginData, setResponse) => async (dispatch) => {
  try {
    dispatch({ type: "SHOW_PROGRESS" });
    const { data } = await api.loginAdmin(loginData);
    dispatch({ type: "HIDE_PROGRESS" });
    dispatch({
      type: ADMIN_SIGNIN,
      payload: data,
    });
  } catch (error) {
    dispatch({ type: "HIDE_PROGRESS" });
    setResponse((prev) => ({
      ...prev,
      status: true,
      message: error.response.data?.message,
    }));
  }
};

export const verifyAdmin = () => async (dispatch, getState) => {
  try {
    const { data } = await api.verifyAdmin();
    if (data.status === 200) {
      dispatch({
        type: ADMIN_VERIFIED,
        payload: data,
      });
    }
  } catch (error) {
    const { response } = error;

    if (response?.status === 401) {
      dispatch({
        type: ADMIN_SIGNOUT,
      });
    }
  }
};
