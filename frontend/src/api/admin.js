import axios from 'axios';
import { ADMIN_SIGNOUT } from '../constants/actionTypes';
import store from '../store';

const API = axios.create({baseURL:'http://localhost:5000/api/admin',withCredentials: true})

export const loginAdmin = (data) => API.post(`/signin`,data);
export const verifyAdmin = () => API.get(`/verify`);
export const getDashboard = () => API.get(`/get-dash-data`);

export const getPaypalId = () => API.get(`/get-paypal-id`)
export const fetchPosts = (skip,limit,status) => API.get(`/fetch-posts?status=${status}&limit=${limit}&skip=${skip}`)
export const fetchUsers = (skip,limit,filter) => API.get(`/fetch-users?filter=${filter}&limit=${limit}&skip=${skip}`)
export const blockUser = (id,status) => API.patch(`/block-user?id=${id}&status=${status}`)
export const removeUser = (id) => API.delete(`/remove-user?id=${id}`)
export const getFullDetails = (id) => API.get(`/get-selected-post?id=${id}`)
export const deletePost = (data) => API.post(`/delete-post`,data)
export const updatePostStatus = (id,status) => API.patch(`/update-post-status?id=${id}&status=${status}`)
export const fetchChannels = (skip,limit,status) => API.get(`/fetch-channels?status=${status}&limit=${limit}&skip=${skip}`)
export const blockChannel = (id,status) => API.patch(`/block-channel?id=${id}&status=${status}`)
export const approveChannel = (id) => API.patch(`/approve-channel?id=${id}`)
export const fetchAds = (skip,limit,status) => API.get(`/fetch-ads?status=${status}&limit=${limit}&skip=${skip}`)
export const getAdRevenueDetails = (id) => API.get(`/fetch-ad-details/${id}`)
export const approveAd = (id) => API.patch(`/approve-ad/`, {adId:id})
export const endCampaign = (id) => API.patch(`/end-campaign/${id}`)
export const fetchPayouts = (skip,limit,filter) => API.get(`/fetch-payouts?filter=${filter}&limit=${limit}&skip=${skip}`)
export const approvePayout = (data,payoutId) => API.patch(`/approve-payout/${payoutId}`,data)

API.interceptors.response.use(response => {
    return response;
}, error => {

    return new Promise ((res,rej)=>{
        if (error.response.status === 401) {
            store.dispatch({
                type: ADMIN_SIGNOUT,
            })
        }
        rej(error)
    })

})