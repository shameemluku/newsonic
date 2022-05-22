const express = require('express');
const router = express.Router();
const { getFileStream } = require('../config/s3');
const { isUserValid,isCreator } = require('../middlewares/auth')

const {
    createChannel,
    getChannelDetails,
    getAddedPosts
} = require('../controllers/channelController')



router.post('/create', isUserValid , createChannel)
router.get('/get-details', isUserValid , getChannelDetails)
router.get('/fetch-added-posts', isUserValid, isCreator , getAddedPosts)


module.exports = router;