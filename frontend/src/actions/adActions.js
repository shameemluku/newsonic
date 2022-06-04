import * as api from '../api';
import {
    REQUEST_CREATE_AD, 
    CREATE_AD_SUCESS,
    SPONSOR_ADS_SUCCESS,
    SPONSOR_ADS_FAILED,
    GET_SPONSOR_ADS
} from '../constants/actionTypes'
import { generateSignature } from '../utility/fingerprint';

export const createAd = (adDetails,setProgress,setResponse)=> async (dispatch) =>{

    try {

        let {data} = await api.createAd(adDetails,setProgress)
        setResponse(data)
        
    } catch (error) {
       
    }

}

export const clickAd = async (details) => {

    try{
       let {data} = await api.clickAd(details,await generateSignature()) 
    } catch (error) {
       
    }
}


export const displayAd = async (details) => {

    try {


        console.log(details);

        let {data} = await api.loadDisplayAd(details,await generateSignature())

        if(data.status) return data.ad;
        
    } catch (error) {
       
    }
}

export const getSponsorAds = (limit,skip)=> async (dispatch) =>{

    try {

        dispatch({type:GET_SPONSOR_ADS})
        
        let {data} = await api.getSponsorAds(limit,skip)
        if(data.status){

            dispatch({
                type:SPONSOR_ADS_SUCCESS,
                payload:data
            })
        }
        
    } catch (error) {
        dispatch({type:SPONSOR_ADS_FAILED})
    }

}

export const endCampaign = (adId) => async (dispatch) =>{
    
    try {
        
        let response = await api.endCampaign(adId)
        console.log(response);

    } catch (error) {
        
    }

}