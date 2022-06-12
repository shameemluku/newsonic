import {
  ADMIN_SIGNIN,
  ADMIN_SIGNOUT,
  ADMIN_VERIFIED,
} from "../constants/actionTypes";
import { encodeData, decodeData } from "../validations/encryptInfo";

let authData = { user: null, loading: false };

try {
  authData = localStorage.getItem("adminInfo")
    ? {
        ...authData,
        user: decodeData(localStorage.getItem("adminInfo")),
      }
    : { user: null };
} catch (error) {
  authData = { ...authData, user: null };
  localStorage.removeItem("adminInfo");
}

export const adminDetails = (user = authData, action) => {
  switch (action.type) {
    case ADMIN_SIGNIN:
      localStorage.setItem("adminInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
        loading: false,
      };

    case ADMIN_VERIFIED:
      localStorage.setItem("adminInfo", encodeData(action.payload));
      return {
        ...user,
        user: action.payload,
        loading: false,
      };

    case ADMIN_SIGNOUT:
      localStorage.removeItem("adminInfo");
      return {
        user: null,
        loading: false,
      };

    default:
      return user;
  }
};

export const showAdminProgress = (state = false, action) => {
  switch (action.type) {
    case "SHOW_ADMIN_PROGRESS":
      return true;
    case "HIDE_ADMIN_PROGRESS":
      return false;
    default:
      return state;
  }
};
