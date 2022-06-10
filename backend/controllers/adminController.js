const jwt = require('jsonwebtoken');
const Ads = require('../models/ad');
const ObjectId = require("mongodb").ObjectID;
const Admin = require("../models/admin");
const Channel = require('../models/channels');
const Payouts = require('../models/payouts');
const Posts = require("../models/posts");
const Revenues = require('../models/revenues');
const Users = require("../models/user");

const adminLogin = async (req, res) => {

    const { email , password } = req.body;
    const user = await Admin.findOne({email});

    if(!user) return res.status(404).json({message:"You are not an admin!"});

    const token = jwt.sign({
        email: user.email, 
        id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );     
    res.cookie("security2",token,{
        httpOnly:true, 
        signed:true,
        maxAge:900000
    });
    console.log("success");
    res.status(200).json({email:user.email,name:user.name});

};

const verifyAdmin = async (req, res) => {

    const tokenId = req.body.decodeId;
    const user = await Admin.findOne({_id:ObjectId(tokenId)})
    
    if(user){
        user.token = req.body.token
        res.status(200).json({email:user.email,name:user.name});
    }else{
        res.status(404).json({status:false});
    }

}


const getDashData = async (req, res) => {
  
    let payout_requests = await Payouts.aggregate([
      {
        $match: {
          isPaid: false,
        },
      },
      { $limit: 10 },
    ]);
  
    let ad_requests = await Ads.aggregate([
      {
        $match: {
          isApproved:false,
        },
      },
      {
        $project: { _id: 1, title: 1, imageSqr:1, estAmount: 1},
      },
      { $limit: 10 },
    ]);
  
    let adCount = await Ads.countDocuments()
    let postCount = await Posts.countDocuments()
    let userCount = await Users.countDocuments()
    let channelCount = await Channel.countDocuments()
    let payoutCount = await Payouts.countDocuments({isPaid:false})
  
  
    let Earnings = await Revenues.aggregate([
      {
        $match: {
          holder: 'ADMIN',
        },
      },
      { $group: { _id: "$isPaid", amount: { $sum: "$amount" } } },
    ]);
  
    let totalEarnings =
      Earnings.length === 2
        ? Earnings[0]?.amount + Earnings[1]?.amount
        : Earnings[0]?.amount;
  
    res.status(200).json({
        payout_requests,
        ad_requests,
        adCount,
        postCount,
        userCount,  
        channelCount,
        payoutCount,
        totalEarnings,
    });
  };


module.exports = {
    adminLogin,
    verifyAdmin,
    getDashData
}