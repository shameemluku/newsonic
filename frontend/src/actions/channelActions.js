import * as api from '../api';
import { 
    CREATE_CHANNEL_SUCCESS, 
    CREATE_CHANNEL_REQUEST, 
    CREATE_CHANNEL_FAILED,
    GET_CHANNEL_DETAILS,
    REQUEST_CHANNEL_DETAILS,
    CHANNEL_DETAILS_FAILURE
} from '../constants/actionTypes'

export const createChannel = (channelData,setProgress,navigate)=> async (dispatch) =>{

    try {

        dispatch({
            type: CREATE_CHANNEL_REQUEST
        });

        const { data } = await api.createChannel(channelData,setProgress);
        console.log(data);

         if(data.status){
            dispatch({
                type: CREATE_CHANNEL_SUCCESS,
                payload: data.details
            });
            navigate("/creator/add")
         }else{

            dispatch({
                type: CREATE_CHANNEL_FAILED,
            })

         }
        
        
    
    } catch (error) {
        dispatch({
            type: CREATE_CHANNEL_FAILED,
        })
    }

}

export const getChannelDetails = ()=> async (dispatch) =>{
    try {

        dispatch({
            type: REQUEST_CHANNEL_DETAILS,
        })

        const { data } = await api.getChannelDetails();
        console.log(data);
        if(data){
            dispatch({
                type: GET_CHANNEL_DETAILS,
                payload:data.channelDetails
            })
        }
        
    } catch (error) {
        dispatch({
            type: CHANNEL_DETAILS_FAILURE,
        })
    }
}