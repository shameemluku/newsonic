import axios from 'axios';
import { USER_SIGNOUT } from '../constants/actionTypes';
import store from '../store';

const API = axios.create({baseURL:'http://localhost:5000/api',withCredentials: true})

// Post endpoints

export const fetchHomeData = () => API.get(`/posts/fetch-home`);
export const fetchPosts = (limit,skip,category) => API.get(`/posts/fetch-news/${category}?limit=${limit}&&skip=${skip}`);
export const fetchPostDetails = (id,signature) => API.get(`/posts/fetch-details/${id}?signature=${signature}`);
export const postComment = (data) => API.post('/posts/post-comment/',data);
export const deleteComment = (data) => API.post('/posts/delete-comment/',data);
export const likePost = (data) => API.post('/posts/like-post/',data);
export const savePost = (data) => API.post('/posts/save-post/',data);
export const deletePost = (data,channelId) => API.post(`/posts/delete-post?channel=${channelId}`,data);
export const deleteDraft = (data,channelId) => API.post(`/posts/delete-draft?channel=${channelId}`,data);
export const getRelated = (cat) => API.post('/posts/fetch-related/',cat);
export const getCategory = () => API.get('/posts/category')
export const getNavlinks = () => API.get('/posts/nav-links')
export const getSavedPosts = () => API.get('/posts/fetch-saved')
export const updatePostText = (data,channelId) => API.patch(`/posts/update-post-data?channel=${channelId}`,data)
export const updatePostCategory = (data,channelId) => API.patch(`/posts/update-post-category?channel=${channelId}`,data)
export const updatePostIsComment = (data,channelId) => API.patch(`/posts/update-post-iscomment?channel=${channelId}`,data)
export const updatePostIsMonetize = (data,channelId) => API.patch(`/posts/update-post-ismonetize?channel=${channelId}`,data)
export const saveDraft = (data) => API.patch(`/posts/save-draft`,data)
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
export const fetchUserProfile = () => API.get('users/fetch-profile');
export const changeDp = (data) => API.patch('users/change-dp',data);
export const removeDp = () => API.patch('users/remove-dp');
export const changeName = (data) => API.patch('users/change-name',data);
export const changePhone = (data) => API.patch('users/change-phone',data);
export const changePassword = (data) => API.patch('users/change-password',data);


//Channel endpoints

export const isNameValiable = (name) => API.post('users/check-avail',{name});
export const getChannelDetails = () => API.get('channel/get-details');
export const getAddedPosts = (channelId,filter,limit) => API.get(`channel/fetch-added-posts?channel=${channelId}&filter=${filter}&limit=${limit}`);
export const getDashboard = (channelId) => API.get(`channel/get-dashdata?channel=${channelId}`);
export const creatorPostDetails = (postId,channelId) => API.get(`channel/get-full-post?postid=${postId}&channel=${channelId}`);
export const getTransactionDetails = (channelId) => API.get(`channel/get-transactions?channel=${channelId}`);
export const requestPayout = (data,channelId) => API.put(`channel/request-payout?channel=${channelId}`,data);
export const cancelPayout = (channelId) => API.delete(`channel/cancel-payout?channel=${channelId}`);
export const updateChannel = (data,channelId) => API.patch(`channel/update-channel?channel=${channelId}`,data);
export const updateChannelImage = (data,channelId) => API.patch(`channel/update-channel-image?channel=${channelId}`,data);
export const createChannel = (channelData,setProgress) => API.post('channel/create',channelData,{
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
    }
});

//Ad Endpoints

export const loadDisplayAd = (data,signature) => API.post(`ad/load-ad?signature=${signature}`,data);
export const clickAd = (data,signature) => API.post(`ad/click-ad?signature=${signature}`,data);
export const getSponsorAds = (limit,skip) => API.get(`ad/sponsor-ads?limit=${limit}&skip=${skip}`);
export const getAdRevenueDetails = (adId) => API.get(`ad/ad-revenue-details/${adId}`);
export const endCampaign = (adId) => API.put(`ad/end-campaign/${adId}`);
export const getBillingData = () => API.get(`ad/fetch-billing-data`);
export const createAd = (data,setProgress) => API.post('ad/create',data, {
    onUploadProgress: data => {
        setProgress(Math.round((100 * data.loaded) / data.total))
    }
});

//Payment Endpoints

export const createRazorOrder = (data) => API.post(`payment/create-order`,data);
export const verifyAndPay = (data) => API.post(`payment/verify-payment`,data);
export const getTransactions = (skip,limit) => API.get(`payment/fetch-transactions?type=SPONSOR&limit=${limit}&skip=${skip}`);


// Get User IP
export const getUserIp = () => API.get('/users/get-ip')
export const translate = (text,language) => API.get(`posts/translate/${text}?lang=${language}`)


 API.interceptors.response.use(response => {
    return response;
 }, error => {
    return new Promise ((res,rej)=>{
        try {
            if (error.response.status === 401) {
                store.dispatch({
                    type: USER_SIGNOUT,
                })
            }
            if (error.response.status === 403) {
                window.location.reload()
            }
            rej(error)
        } catch (error) {
            rej(error)
        }
        
    })

})

