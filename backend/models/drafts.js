const mongoose = require('mongoose');

const draftSchema = mongoose.Schema({
  
    newsHead: { type: String },
    newsBody: { type: String },
    category: [String],
    isComment:{type:Boolean, default:true},
    isMonetize:{type:Boolean, default:false},
    channelId:{type: mongoose.Schema.ObjectId, ref: 'channels'},
    
})

const Drafts = mongoose.model("Drafts", draftSchema);
module.exports = Drafts;