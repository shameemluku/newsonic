const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    sponsorId:{type: mongoose.Schema.ObjectId, ref: 'users'},
    title: { type: String },
    url: { type: String },
    format:{ type: String },
    startDate:{type:Date},
    endDate:{type:Date},
    estView:{type:Number},
    imageFrm:{type:String},
    imageSqr:{type:String},
    estAmount:{type:Number},
    views:[
        {
            idType:String,
            userId:String,
            holder:String,
        }
    ],
    clicks:[
        {
            idType:String,
            userId:String,
            holder:String,
        }
    ],
    amount:{type:Number,default:0},
    isCancelled:{type:Boolean, default:false},
    isApproved:{type:Boolean, default:false}
})

const Ads = mongoose.model("ads", adSchema);
module.exports = Ads;   