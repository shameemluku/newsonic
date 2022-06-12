import * as api from "../api";
import {
  REQUEST_CREATE_AD,
  CREATE_AD_SUCESS,
  SPONSOR_ADS_SUCCESS,
  SPONSOR_ADS_FAILED,
  GET_SPONSOR_ADS,
  SPONSOR_ADS_CANCELLED,
} from "../constants/actionTypes";
import { generateSignature } from "../utility/fingerprint";

export const createAd =
  (adDetails, setProgress, setResponse) => async (dispatch) => {
    try {
      let { data } = await api.createAd(adDetails, setProgress);
      setResponse(data);
    } catch (error) {}
  };

export const clickAd = async (details) => {
  try {
    let { data } = await api.clickAd(details, await generateSignature());
  } catch (error) {}
};

export const displayAd = async (details) => {
  try {
    let { data } = await api.loadDisplayAd(details, await generateSignature());

    if (data.status) return data.ad;
  } catch (error) {}
};

export const getSponsorAds = (limit, skip) => async (dispatch) => {
  try {
    dispatch({ type: GET_SPONSOR_ADS });

    let { data } = await api.getSponsorAds(limit, skip);
    if (data?.status) {
      dispatch({
        type: SPONSOR_ADS_SUCCESS,
        payload: data,
      });
    }
  } catch (error) {
    dispatch({ type: SPONSOR_ADS_FAILED });
  }
};

export const endCampaign = (adId, setAdData) => async (dispatch, getState) => {
  try {
    const { sponsorDetails } = getState();
    dispatch({ type: "SHOW_PROGRESS" });
    let { data } = await api.endCampaign(adId);
    dispatch({ type: "HIDE_PROGRESS" });
    if (data.status) {
      sponsorDetails?.ads.forEach((ad, i) => {
        if (ad._id === adId) {
          if (ad.status === "Active") sponsorDetails.active--;
          sponsorDetails.ads[i].isCancelled = true;
          sponsorDetails.ads[i].status = "Cancelled";
        }
      });
      setAdData((prev) => ({
        ...prev,
        status: "Cancelled",
        isCancelled: true,
      }));
      dispatch({
        type: SPONSOR_ADS_CANCELLED,
        payload: sponsorDetails.ads,
      });
    }
  } catch (error) {}
};
