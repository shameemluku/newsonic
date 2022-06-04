const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  
    newsHead: { type: String, required: true },
    newsBody: { type: String , required:true },
    category: [String],
    isComment:{type:Boolean, default:true},
    isMonetize:{type:Boolean, default:false},
    channelId:{type: mongoose.Schema.ObjectId, ref: 'channels'},
    images: [String],
    postDate:{ type: String, required: true },
    comments:[
        {
          userId: {type: mongoose.Schema.ObjectId, ref: 'users'},
          commentId: {type: mongoose.Schema.ObjectId},
          text: String,
          date:Date,
          likes: [Number]
        }
      ],
    likes:[{type: mongoose.Schema.ObjectId, ref: 'users'}],
    status:{type: String, default:"PUBLIC"},
    seenBy:[
      {
        idType:String,
        userId:String
      }
    ],
    amount:{type:Number}
    
})

const Posts = mongoose.model("posts", postSchema);
module.exports = Posts;