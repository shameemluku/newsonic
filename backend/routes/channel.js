const express = require('express');
const router = express.Router();
const { getFileStream } = require('../config/s3');
const { isUserValid } = require('../middlewares/auth')

const {
    createChannel,
    getChannelDetails
} = require('../controllers/channelController')



router.post('/create', isUserValid , createChannel)
router.get('/get-details', isUserValid , getChannelDetails)


router.get('/hi', (req,res)=>{
    res.send("hi")
})

module.exports = router;