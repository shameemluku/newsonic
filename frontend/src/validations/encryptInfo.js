import CryptoJS from "crypto-js";

export const encodeData = (data) => {
  let ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_SECRET
  ).toString();
  return ciphertext;
};

export const decodeData = (data) => {
  let bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
