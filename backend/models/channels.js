const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String , required:true },
    userId: { type: String, required: true },
    phone: {type:Number,required:true},
    website:{type:String, default:null},
    image:{type:String},
    isApproved:{type:Boolean, default:false},
    isBlocked:{type:Boolean, default:false},
    supportFiles:{type:Array},
    paymentAccount:{type:String,default:null}
})

const Channel = mongoose.model("channels", channelSchema);


module.exports = Channel;