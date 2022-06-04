const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    payId:{type:String},
    date:{type:Date},
    type:{type:String},
    amount:{type:Number},
    method:{type:String},
    sponsorId:{type: mongoose.Schema.ObjectId, ref: 'users'},
    channelId:{type: mongoose.Schema.ObjectId, ref: 'channels'},
})

const Transactions = mongoose.model("transactions", transactionSchema);
module.exports = Transactions;