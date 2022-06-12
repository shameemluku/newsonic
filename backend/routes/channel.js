const express = require('express');
const router = express.Router();

const { 
    isUserValid,
    isCreator 
} = require('../middlewares/authMiddleware')

const {
    createChannel,
    getChannelDetails,
    getAddedPosts,
    getDashData,
    getCreatorPostDetails,
    getTransactionDetails,
    payoutRequest,
    cancelPayout,
    updateChannelData,
    updateChannelPic
} = require('../controllers/channelController')
const { getFileStream } = require('../config/s3');



router.post('/create', isUserValid , createChannel)
router.get('/get-details', isUserValid , getChannelDetails)
router.get('/fetch-added-posts', isUserValid, isCreator , getAddedPosts)
router.get('/get-dashdata', isUserValid, isCreator,  getDashData)
router.get('/get-full-post', isUserValid, isCreator,  getCreatorPostDetails)
router.get('/get-transactions', isUserValid, isCreator,  getTransactionDetails)
router.put('/request-payout', isUserValid, isCreator,  payoutRequest)
router.delete('/cancel-payout', isUserValid, isCreator,  cancelPayout)
router.patch('/update-channel', isUserValid, isCreator,  updateChannelData)
router.patch('/update-channel-image', isUserValid, isCreator,  updateChannelPic)


module.exports = router;