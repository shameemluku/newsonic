const mongoose = require('mongoose');

const revenueSchema = mongoose.Schema({
    adId:{type: mongoose.Schema.ObjectId, ref: 'ads'},
    sponsorId:{type: mongoose.Schema.ObjectId, ref: 'users'},
    holder:{type:String},
    postId:{type: mongoose.Schema.ObjectId, ref: 'posts'},
    channelId:{type: mongoose.Schema.ObjectId, ref: 'channels'},
    revType:{type:String},
    amount:{type:Number},
    isPaid:{type:Boolean, default:false},
    isWithdrawn:{type:Boolean, default:false}
})

const Revenues = mongoose.model("revenues", revenueSchema);
module.exports = Revenues;