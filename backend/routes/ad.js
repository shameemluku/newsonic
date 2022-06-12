const express = require('express');
const router = express.Router();

const {
    createAd,
    loadDisplayAd,
    approveAd,
    adClicked,
    sponsorDetails,
    getRevenueDetails,
    endCampaign,
    getBillingData
} = require("../controllers/adController");

const { getFileStream } = require('../config/s3');
const { isUserValid,isCreator } = require('../middlewares/authMiddleware')
const { checkUserType } = require('../middlewares/adMiddleware');

router.post('/create' , isUserValid, createAd)
router.post('/load-ad', checkUserType , loadDisplayAd)
router.post('/click-ad' , checkUserType , adClicked)
router.get('/sponsor-ads' , isUserValid , sponsorDetails)
router.get('/ad-revenue-details/:adId' , isUserValid , getRevenueDetails)
router.put('/end-campaign/:adId' , isUserValid , endCampaign)
router.get('/fetch-billing-data' , isUserValid , getBillingData)

module.exports = router;