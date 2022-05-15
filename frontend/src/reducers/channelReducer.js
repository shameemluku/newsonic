import { 
    CREATE_CHANNEL_SUCCESS, 
    CREATE_CHANNEL_REQUEST, 
    CREATE_CHANNEL_FAILED,
    GET_CHANNEL_DETAILS,
    REQUEST_CHANNEL_DETAILS,
    CHANNEL_DETAILS_FAILURE
 } from '../constants/actionTypes'

let initalState = {
    channel:null,
    loading:false
}
export const createChannel = (state = initalState , action) => {
    switch (action.type){
        case CREATE_CHANNEL_REQUEST:
            return {...state,loading:true}
            
        case CREATE_CHANNEL_FAILED:
            return {
                ...state,
                success:false,
                loading:false,
            }

        case CREATE_CHANNEL_SUCCESS:
            return {
                ...state,
                loading:false,
                success:true,
                channel:action.payload
            }


        default:
            return state;
    }
}


export const channelDetails = (state = {channel:null, loading:false} , action) => {
    switch (action.type){
        case REQUEST_CHANNEL_DETAILS:
            return {
                ...state,
                loading:true
            }
        case GET_CHANNEL_DETAILS:
            return {
                ...state,
                loading:false,
                channel:action.payload
            }

        case CHANNEL_DETAILS_FAILURE:
            return {
                ...state,
                loading:false
            }

        default:
            return state;
    }
}