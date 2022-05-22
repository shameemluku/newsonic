import axios from 'axios';

const API = axios.create({baseURL:'http://localhost:5000/api',withCredentials: true})

// Post endpoints

export const fetchHomeData = () => API.get(`/posts/fetch-home`);
export const fetchPosts = (limit,skip,category) => API.get(`/posts/fetch-news/${category}?limit=${limit}&&skip=${skip}`);
export const fetchPostDetails = (id,signature) => API.get(`/posts/fetch-details/${id}?signature=${signature}`);
export const postComment = (data) => API.post('/posts/post-comment/',data);
export const deleteComment = (data) => API.post('/posts/delete-comment/',data);
export const createPost = (newPost,setProgress,progress) => API.post('/posts/addpost',newPost,{
    onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
    }
});
export const likePost = (data) => API.post('/posts/like-post/',data);
export const savePost = (data) => API.post('/posts/save-post/',data);
export const deletePost = (data,channelId) => API.post(`/posts/delete-post?channel=${channelId}`,{id:data});
export const getRelated = (cat) => API.post('/posts/fetch-related/',cat);
export const getCategory = () => API.get('/posts/category')

//User endpoints

export const signUp = (formData) => API.post('users/signup',formData);
export const signIn = (formData) => API.post('users/signin',formData);
export const signOut = () => API.get('users/signout');
export const verifyUser = () => API.get('users/verify');


//Channel endpoints

export const isNameValiable = (name) => API.post('users/check-avail',{name});
export const createChannel = (channelData,setProgress) => API.post('channel/create',channelData,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
    }
});
export const getChannelDetails = () => API.get('channel/get-details');
export const getAddedPosts = (channelId,filter) => API.get(`channel/fetch-added-posts?channel=${channelId}&filter=${filter}`);


// Get User IP
export const getUserIp = () => API.get('/users/get-ip')
