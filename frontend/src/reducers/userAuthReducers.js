import { encodeData, decodeData } from "../validations/encryptInfo";
import {
  USER_SIGNUP,
  USER_SIGNIN,
  USER_VERIFIED,
  USER_SIGNOUT,
  UPDATE_USER,
  USER_SIGNUP_LOAD,
  USER_SIGNIN_LOAD,
  USER_LOAD_END,
} from "../constants/actionTypes";

let authData = {};

try {
  authData = localStorage.getItem("userInfo")
    ? {
        ...authData,
        user: decodeData(localStorage.getItem("userInfo")),
      }
    : {
        user: null,
        signInLoading: false,
        signUpLoading: false,
      };
} catch (error) {
  authData = {
    ...authData,
    user: null,
    signInLoading: false,
    signUpLoading: false,
  };
  localStorage.removeItem("userInfo");
}

export const authReducer = (user = authData, action) => {
  switch (action.type) {
    case USER_SIGNUP:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
        signUpLoading: false,
      };

    case USER_SIGNIN:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
        signInLoading: false,
      };

    case USER_VERIFIED:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
      };

    case UPDATE_USER:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
      };

    case USER_SIGNUP_LOAD:
      return {
        ...user,
        signUpLoading: true,
      };
    case USER_SIGNIN_LOAD:
      return {
        ...user,
        signInLoading: true,
      };

    case USER_LOAD_END:
      return {
        ...user,
        signInLoading: false,
        signUpLoading: false,
      };

    case USER_SIGNOUT:
      localStorage.removeItem("userInfo");
      return {
        ...user,
        user: null,
      };

    default:
      return user;
  }
};

export const showLoginModal = (modalState = false, { type, payload }) => {
  switch (type) {
    case "SHOW_MODAL":
      return true;
    case "CLOSE_MODAL":
      return false;
    default:
      return modalState;
  }
};
