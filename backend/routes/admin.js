const express = require('express');
const router = express.Router();

const { 
    adminLogin, 
    verifyAdmin,
    getDashData,
    logoutAdmin
} = require('../controllers/adminController');
const { 
    fetchAllChannels ,
    blockChannel,
    approveChannel
} = require('../controllers/channelController');
const { 
    fetchPosts,
    getSelectedPost,
    updatePostStatus,
    deletePost
} = require('../controllers/postControllers');
const { 
    fetchUsers, 
    blockUser, 
    removeUser 
} = require('../controllers/usersController');
const { 
    fetchAllAds, 
    getRevenueDetails, 
    approveAd, 
    endCampaign
} = require('../controllers/adController');
const { 
    fetchPayouts,
    getPaypalId,
    approvePayout
} = require('../controllers/paymentController');
const { isAdmin } = require('../middlewares/authMiddleware');


router.post('/signin', adminLogin);
router.get('/verify', isAdmin, verifyAdmin);
router.get('/logout', isAdmin, logoutAdmin);
router.get('/get-dash-data', isAdmin, getDashData);
router.get('/get-paypal-id', isAdmin, getPaypalId);
router.get('/fetch-posts', isAdmin, fetchPosts);
router.get('/get-selected-post', isAdmin, getSelectedPost);
router.get('/fetch-users', isAdmin, fetchUsers);
router.patch('/block-user', isAdmin, blockUser);
router.delete('/remove-user', isAdmin, removeUser);
router.patch('/update-post-status', isAdmin, updatePostStatus);
router.post('/delete-post', isAdmin, deletePost);
router.get('/fetch-channels', isAdmin, fetchAllChannels);
router.patch('/block-channel', isAdmin, blockChannel);
router.patch('/approve-channel', isAdmin, approveChannel);
router.get('/fetch-ads', isAdmin, fetchAllAds);
router.get('/fetch-ad-details/:adId', isAdmin, getRevenueDetails);
router.patch('/approve-ad', isAdmin , approveAd)
router.patch('/end-campaign/:adId' , isAdmin , endCampaign)
router.get('/fetch-payouts' , isAdmin , fetchPayouts)
router.patch('/approve-payout/:payoutId' , isAdmin , approvePayout)

module.exports = router;