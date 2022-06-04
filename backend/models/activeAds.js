const mongoose = require('mongoose');

const activeAdSchema = mongoose.Schema({
    adId:{type: mongoose.Schema.ObjectId, ref: 'ads'},
    startDate:{type:Date},
    format:{type:String},
    endTime:{type:Date}
})

activeAdSchema.index({ "endTime": 1 }, { expireAfterSeconds: 0 })
const ActiveAds = mongoose.model("activeads", activeAdSchema);
module.exports = ActiveAds;   