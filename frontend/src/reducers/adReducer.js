import {
    GET_SPONSOR_ADS,
    SPONSOR_ADS_SUCCESS,
    SPONSOR_ADS_FAILED,
  } from "../constants/actionTypes";

export const sponsorDetails = (
  sponsor = {
    ads:[],
    amount:0.00,
    loading:false
  }
  , action) => {
    switch (action.type) {
      case GET_SPONSOR_ADS:
        return {
          ...sponsor,
          loading:true
        }
  
      case SPONSOR_ADS_SUCCESS:
        return {
          ...sponsor,
          loading:false,
          ads:action.payload.ads,
          amount:action.payload.total_amount
        }

      case SPONSOR_ADS_FAILED:
        return {
          ...sponsor,
          loading:false,
        }
      
      default:
        return sponsor
    }
  }