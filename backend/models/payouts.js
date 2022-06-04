const mongoose = require('mongoose');

const payoutSchema = mongoose.Schema({

    channelId:{type: mongoose.Schema.ObjectId, ref: 'channels'},
    date: { type: Date , required: true },
    paypalId:{ type: String, required: true },
    amount:{type:Number , required: true},
    isPaid:{type:Boolean, default:false},
})

const Payouts = mongoose.model("payouts", payoutSchema);
module.exports = Payouts;