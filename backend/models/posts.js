const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    newsHead: { type: String, required: true },
    newsBody: { type: String , required:true },
    category: [String],
    isComment:{type:Boolean, default:false},
    isMonetize:{type:Boolean, default:false},
    channelId:{type: mongoose.Schema.ObjectId, ref: 'channelId'},
    images: [String],
    postDate:{ type: String, required: true },
    comments:[
        {
          userId: String,
          userId: String,
          body: Boolean,
          likes: [Number]
        }
      ]
})

const Posts = mongoose.model("posts", postSchema);


module.exports = Posts;