import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";

export const generateSignature = () => {
  return new Promise(async (res, rej) => {
    let fp = await FingerprintJS.load();
    let { visitorId } = await fp.get();
    res(visitorId);
  });
};

export const INR2USD = async (amount) => {
  let { data } = await axios.get(
    "https://free.currconv.com/api/v7/convert?q=USD_INR&compact=ultra&apiKey=79fe3aa96044fccaecec"
  );
  let current_rate = data["USD_INR"];
  return (amount / current_rate).toFixed(2).toString();
};
