import * as api from '../api';
import { REQUEST_POST_DETAILS, FULL_POST_DETAILS, REQUEST_COMMENT } from '../constants/actionTypes';

export const getPosts = ()=> async (dispatch) =>{

    try {

        let params = {limit:10,category:"all"}
        const { data } = await api.fetchPosts(params);
        dispatch({
            type: 'FETCH_ALL',
            payload: data
        });
    
    } catch (error) {
        console.log(error.message)
    }

}


export const createPost = (post,setProgress,progress)=> async (dispatch) =>{
    try {
        const {data} = await api.createPost(post,setProgress,progress);
        console.log(data.buffer.data);
        // dispatch({
        //     type:"CREATE",
        //     payload:data
        // })
    } catch (error) {
        console.log(error.message);
    }
}


export const getPostDetails = (postId)=> async (dispatch) =>{
    try {
        dispatch({
            type:REQUEST_POST_DETAILS
        })
        const {data} = await api.fetchPostDetails(postId)
        console.log(data.post_details);

        dispatch({
            type:FULL_POST_DETAILS,
            payload:data.post_details
        })

    } catch (error) {
        console.log(error.message);
    }
}

export const postComment = (commentData)=> async (dispatch) =>{
    try {
        // dispatch({
        //     type:REQUEST_COMMENT
        // })
        console.log(commentData);
        const {data} = await api.postComment(commentData)
        console.log(data.post_details);

        // dispatch({
        //     type:FULL_POST_DETAILS,
        //     payload:data.post_details
        // })

    } catch (error) {
        console.log(error.message);
    }
}