import { encodeData, decodeData } from "../validations/encryptInfo";
import {
  USER_SIGNUP,
  USER_SIGNIN,
  USER_VERIFIED,
  USER_SIGNOUT
} from "../constants/actionTypes";

let authData = { user: null };

try {
  authData = localStorage.getItem("userInfo")
    ? {
        ...authData,
        user: decodeData(localStorage.getItem("userInfo")),
        message: "Main-try-true",
      }
    : { user: null, message: "Main-try-false" };
} catch (error) {
  authData = { ...authData, user: null, message: "MainCatch" };
  localStorage.removeItem("userInfo");
}

export const authReducer = (user = authData, action) => {
  switch (action.type) {
    case USER_SIGNUP:
      console.log("Here inside auth");
      localStorage.setItem("userInfo", encodeData(action.payload));
      return { 
        ...user, 
        user: action.payload, 
        message: "signup" 
      };

    case USER_SIGNIN:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return { 
        ...user, 
        user: action.payload, 
        message: "signin" 
      };

    case USER_VERIFIED:
      localStorage.setItem("userInfo", encodeData(action.payload));
      return { 
        ...user, 
        user: action.payload, 
        message: "varify" 
      };

    case USER_SIGNOUT:
      localStorage.removeItem("userInfo");
      return { 
        ...user, 
        user: null,
        message: "Signout" 
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
