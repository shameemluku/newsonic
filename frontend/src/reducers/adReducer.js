import {
  GET_SPONSOR_ADS,
  SPONSOR_ADS_SUCCESS,
  SPONSOR_ADS_FAILED,
  SPONSOR_ADS_CANCELLED,
} from "../constants/actionTypes";

export const sponsorDetails = (
  sponsor = {
    ads: [],
    amount: 0.0,
    active: 0,
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case GET_SPONSOR_ADS:
      return {
        ...sponsor,
        loading: true,
      };

    case SPONSOR_ADS_SUCCESS:
      return {
        ...sponsor,
        loading: false,
        ads: action?.payload.ads,
        amount: action?.payload.total_amount,
        active: action?.payload.active,
      };

    case SPONSOR_ADS_FAILED:
      return {
        ...sponsor,
        loading: false,
      };

    case SPONSOR_ADS_CANCELLED:
      return {
        ...sponsor,
        ads: action?.payload,
      };

    default:
      return sponsor;
  }
};
