import { 
    REQUEST_POST_DETAILS,
    CLEAR_POST_DETAILS,
    SET_POST_DETAILS,
    FULL_POST_DETAILS 
} from "../constants/actionTypes";

export const posts = (posts=[],action)=>{
    switch (action.type){
        case 'FETCH_ALL':
            return action.payload;
        case 'CREATE':
            return posts;
        default:
            return posts;
    }
}

export const selectedPost = (posts={details:{},loading:false},action)=>{
    switch (action.type){
        case SET_POST_DETAILS:
            return {
                ...posts,
                details:action.payload
            }

        case REQUEST_POST_DETAILS:
            return {
                ...posts,
                loading:true
            }
        case FULL_POST_DETAILS:
            return {
                ...posts,
                details:action.payload[0],
                loading:false
            }
        case CLEAR_POST_DETAILS:
            return {
                ...posts,
                details:{},
                loading:false
            }

        default:
            return posts;
    }
}