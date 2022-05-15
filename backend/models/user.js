const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String , required:true },
    password: {type:String},
    type: {type:String},
    phone: {type:Number,default:null},
    isBlocked:{type:Boolean, default:false},
    isCreator:{type:Boolean, default:false},
    channelName:{type:String,default:null}
})

const User = mongoose.model("users", userSchema);


module.exports = User;