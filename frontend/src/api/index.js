import axios from 'axios';

const API = axios.create({baseURL:'http://localhost:5000/api',withCredentials: true})

// API.interceptors.request.use((req)=>{
//     if(localStorage.getItem('userInfo')){
//         req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`; 
//     }
//     return req;
// })

// Post endpoints

export const fetchPosts = ({limit,category}) => API.get(`/posts/fetch-news/${category}?limit=${limit}`);
export const fetchPostDetails = (id) => API.get('/posts/fetch-details/'+id);
export const postComment = (data) => API.post('/posts/post-comment/',data);
export const createPost = (newPost,setProgress,progress) => API.post('/posts/addpost',newPost,{
    onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
    }
});

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