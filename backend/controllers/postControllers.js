const base64ToImage = require("base64-to-image");
const { uploadBaseFile, deleteFile } = require("../config/s3");
const User = require("../models/user");
const Posts = require("../models/posts");
const Categories = require("../models/category");
const Navlinks = require("../models/navlinks");
const Drafts = require("../models/drafts");
const ObjectId = require("mongodb").ObjectID;
const {Translate} = require('@google-cloud/translate').v2



// @desc    Creating a Brands
// @rout    POST /api/coupons
const addPosts = async (req, res) => {
  let { 
    newsHead, 
    newsBody, 
    category, 
    comment, 
    monetize, 
    channelId,
    draftId
  } = req.body;

  let channel_result = await Posts.create({
    newsHead,
    newsBody,
    channelId: new ObjectId(channelId),
    category,
    isComment: !comment,
    isMonetize: monetize,
    postDate: new Date(),
  });

  if(draftId) await Drafts.deleteOne({_id:ObjectId(draftId)})
  let promises = [];

  req.body.images.forEach((file, i) => {
    let buffer = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    var data = {
      Key: `${channel_result._id}-${i}`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    promises.push(uploadBaseFile(data));

  });

  Promise.all(promises)
    .then(async function (imagesArray) {
      const update_result = await Posts.findOneAndUpdate(
        { _id: ObjectId(channel_result._id) },
        {
          $set: {
            images: imagesArray,
          },
        }
      );

      res.status(200).json({ status: true, details: update_result });
    })
    .catch(function (err) {
      res.send(err.stack);
    });
};


const saveDraft = async (req, res) => {
  
  let { newsHead, newsBody, category, comment, monetize, channelId , draftId } = req.body;

  await Drafts.replaceOne(
  { _id: ObjectId(draftId) },
  {
    newsHead,
    newsBody,
    channelId: new ObjectId(channelId),
    category,
    isComment: !comment,
    isMonetize: monetize
  },
  {upsert:true});

  res.status(200).json({status:true, message:'Saved to drafts'})

};



const fetchHomeData = async (req, res) => {

  let posts = await fetchByCategory("all", 20);
  let eduPosts = await fetchByCategory("Education", 10);
  let techPosts = await fetchByCategory("Technology", 10);
  let businessPosts = await fetchByCategory("Business", 10);
  
  let most_liked = await Posts.aggregate([
    { $match: {status:"PUBLIC"} },
    { $addFields: { likes: { $size: { $ifNull: ["$likes", []] } } } },
    { $addFields: { image: { $arrayElemAt: ["$images", 0] } } },
    {
      $project: { _id: 1, newsHead: 1, likes: 1, image: 1 },
    },
    {
      $sort: { likes: -1 },
    },
    { $limit: 10 },
  ]);

  res.status(200).json({
    status: true,
    posts,
    education: eduPosts,
    technology: techPosts,
    business: businessPosts,
    top:most_liked,
  });
};

const fetchNews = async (req, res) => {

  let { limit, skip } = req.query;
  let { category } = req.params;

  if (category && category !== "all") {
    category = category[0].toUpperCase() + category.toLowerCase().slice(1);
  }

  let match = category === "all" 
    ? { status:"PUBLIC" } 
    : { category: category, status:"PUBLIC" };

  let posts = await Posts.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        newsHead: 1,
        newsBody: 1,
        category: 1,
        channelId: 1,
        images: 1,
        postDate: 1,
      },
    },
    { $sort: { _id: -1 } },
    { $limit: parseInt(limit) },
    { $skip: parseInt(skip) },
  ]);

  if (posts.length === 0) res.status(200).json({ status: false });
  else res.status(200).json({ status: true, posts });
};

const fetchDetails = async (req, res) => {
  try {
    const { userId, type } = req.identity;
    const { id } = req.params;

    let response = await Posts.updateOne(
      {
        _id: ObjectId(id),
        seenBy: {
          $not: {
            $elemMatch: {
              userId: userId,
            },
          },
        },
      },
      {
        $addToSet: {
          seenBy: {
            userId: userId,
            idType: type,
          },
        },
      },
      {
        multi: true,
      }
    );

    let post_details = await Posts.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      { $addFields: { views: { $size: { $ifNull: ["$seenBy", []] } } } },
      { $addFields: { likes: { $size: { $ifNull: ["$likes", []] } } } },
      {
        $lookup: {
          from: "channels",
          localField: "channelId",
          foreignField: "_id",
          as: "channelDetails",
        },
      },
      {
        $unwind: {
          path: "$comments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "postcomments",
        },
      },
      {
        $unwind: {
          path: "$postcomments",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          "comments.commentId": "$comments.commentId",
          "comments.userId": "$postcomments._id",
          "comments.username": "$postcomments.name",
          "comments.userImage": "$postcomments.image",
          "comments.text": "$comments.text",
          "comments.date": "$comments.date",
        },
      },
      {
        $group: {
          _id: "$_id",
          newsHead: {
            $first: "$newsHead",
          },
          newsBody: {
            $first: "$newsBody",
          },
          category: {
            $first: "$category",
          },
          isComment: {
            $first: "$isComment",
          },
          isMonetize: {
            $first: "$isMonetize",
          },
          images: {
            $first: "$images",
          },
          postDate: {
            $first: "$postDate",
          },
          comments: {
            $push: "$comments",
          },
          channelDetails: {
            $first: "$channelDetails",
          },
          views: {
            $first: "$views",
          },
          likes: {
            $first: "$likes",
          },
        },
      },
      { $addFields: { isLiked: req.isLiked } },
      { $addFields: { isSaved: req.isSaved } },
    ]);

    if (post_details.length === 0) {
      res.status(200).json({ post_details });
    } else {
      post_details[0].comments =
        Object.keys(post_details[0]?.comments[0]).length === 0
          ? []
          : post_details[0]?.comments;
      res.status(200).json({ post_details });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Internal Error", message: error.message });
  }
};

const postComment = async (req, res) => {
  const { postId, comment, decodeId } = req.body;

  let commentData = {
    userId: ObjectId(decodeId),
    text: comment,
    date: new Date(),
    commentId: ObjectId(),
  };

  let response = await Posts.findByIdAndUpdate(
    { _id: ObjectId(postId) },
    { $push: { comments: commentData } }
  );

  if (response) {
    res.status(200).json({ status: true, comment: commentData });
  }
};

const deleteComment = async (req, res) => {
  const { commentId, decodeId, postId } = req.body;

  let response = await Posts.updateOne(
    { _id: ObjectId(postId) },
    { $pull: { comments: { commentId: ObjectId(commentId) } } }
  );

  if (response) {
    res.status(200).json({ status: true });
  } else {
    res.status(400).json({ status: true });
  }
};

const likePost = async (req, res) => {
  let { userId, postId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "No user found!!" });
  } else {
    let response = await Posts.findOne({
      _id: ObjectId(postId),
      likes: ObjectId(userId),
    });

    if (response) {
      let like_result = await Posts.updateOne(
        { _id: Object(postId) },
        { $pull: { likes: ObjectId(userId) } }
      );

      res.status(200).json({ status: false, message: "You Unliked the post" });
    } else {
      let like_result = await Posts.updateOne(
        { _id: Object(postId) },
        { $addToSet: { likes: ObjectId(userId) } }
      );
      res.status(200).json({ status: true, message: "You liked the post" });
    }
  }
};

const savePost = async (req, res) => {
  let { userId, postId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "No user found!!" });
  } else {
    let response = await User.findOne({
      _id: ObjectId(userId),
      saved: ObjectId(postId),
    });

    if (response) {
      let save_result = await User.updateOne(
        { _id: Object(userId) },
        { $pull: { saved: ObjectId(postId) } }
      );

      res.status(200).json({ status: false, message: "You Saved the post" });
    } else {
      let save_result = await User.updateOne(
        { _id: Object(userId) },
        { $addToSet: { saved: ObjectId(postId) } }
      );
      res.status(200).json({ status: true, message: "You Saved the post" });
    }
  }
};

const deletePost = async (req, res) => {

  const { 
    deleteIDs: idArray ,
    deleteImages: images
  } = req.body;


  let response = await Posts.deleteMany({ _id: { $in: idArray } });

  if (response) {

    await deletePostFiles(images)
    res
      .status(200)
      .json({ status: true, message: "Documents deleted successfully!" });
  }

};

const deleteDraft = async (req, res) => {

  const {  deleteIDs: idArray} = req.body;

  let response = await Drafts.deleteMany({ _id: { $in: idArray } });
  if (response) {

    res.status(200).json({ 
      status: true, 
      message: "Documents deleted successfully!" 
    });
  }

};

const getCategory = async (req, res) => {
  let response = await Categories.find();

  if (response) {
    res.status(200).json({ status: true, categories: response });
  }
};

const getNavLinks = async (req, res) => {
  let response = await Navlinks.find();

  if (response) {
    res.status(200).json({ status: true, categories: response });
  }
};

const relatedPost = async (req, res) => {
  let response = await Posts.find({ $in: { category: req.body } }).sort({
    _id: -1,
  });

  if (response) {
    res.status(200).json({ status: true, posts: response });
  }
};

const savedPosts = async (req, res) => {
  const { decodeId: userId } = req.body;

  let response = await User.findOne({ _id: ObjectId(userId) }).populate(
    "saved",
    "_id newsHead newsBody images"
  );
  res.status(200).json({ status: true, posts: response.saved });
};

const updatePostText = async (req, res) => {
  try {

    const { postId, title, body } = req.body;


    let update_post = await Posts.findById(postId)
    update_post.newsHead = title
    update_post.newsBody = body

    
    await update_post.save();
    res.status(200).json({ status: true });

  } catch (error) {
    console.log(error);
  }
};


const updatePostCategory = async (req, res) => {
  try {

    const { postId, category } = req.body;

    let update_post = await Posts.findById(postId)
    update_post.category = category
    await update_post.save();

    res.status(200).json({ status: true });

  } catch (error) {}
};

const updatePostIsComment = async (req, res) => {
  try {

    const { postId, isComment } = req.body;

    let update_post = await Posts.findById(postId)
    update_post.isComment = isComment
    await update_post.save();

    res.status(200).json({ status: true });

  } catch (error) {}
};

const updatePostIsMonetize = async (req, res) => {
  try {

    const { postId, isMonetize } = req.body;

    let update_post = await Posts.findById(postId)
    update_post.isMonetize = isMonetize
    await update_post.save();

    res.status(200).json({ status: true });

  } catch (error) {}
};

const translatePost = async (req, res) => {
  try {

    const translate = new Translate({
      projectId:"newsonic-350320",
      credentials:JSON.parse(process.env.GOOGLE_CREDENTIALS)
    })
    
    const { content } = req.params;
    const { lang:target } = req.query;

    if(content===null) return res.status(400).json({})
    
    const [translation] = await translate.translate(content, target);
    res.status(200).json({ status:true, translation});

  } catch (error) {
    console.log(error);
  }
};


// For Admin //


const fetchPosts = async (req,res) => {

    const {skip,limit,status} = req.query
    let match = {}

    if(status==='ALL') match = {}
    if(status==='PUBLIC') match = { status:"PUBLIC" }
    if(status==='REVIEW') match = { status:"REVIEW" }

    let posts = await Posts.aggregate([
        {
          $match: match
        },
        { $addFields: { likes: { $size: { $ifNull: ["$likes", []] } } } },
        { $addFields: { comments: { $size: { $ifNull: ["$comments", []] } } } },
        { $addFields: { seen: { $size: { $ifNull: ["$seenBy", []] } } } },
        { $addFields: { image: { $arrayElemAt: ["$images", 0] } } },
        {
          $project: { 
              _id: 1, 
              newsHead: 1, 
              postDate:1,
              likes: 1, 
              seen:1,
              image: 1,
              comments:1,
              status:1,
              isMonetized: 1, 
            },
        },
        {
            $sort: { _id: -1 },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
    ])
    
    if(await Posts.countDocuments() === parseInt(skip)) return  res.status(200).json({
        posts, 
        message:"No more to load"
    })

    res.status(200).json({posts})
}


const getSelectedPost = async (req, res) => {
    
    const id = req.query.id;
  
    let post_details = await Posts.aggregate([
      {
        $match: {
          _id: ObjectId(id)
        }
      },
      { $addFields: { views: { $size: { $ifNull: ["$seenBy", []] } } } },
      { $addFields: { likes: { $size: { $ifNull: ["$likes", []] } } } },
      { $addFields: { comments: { $size: { $ifNull: ["$comments", []] } } } },
      { $project: {
          _id:1,
          newsHead:1,
          newsBody:1,
          comments:1,
          category:1,
          images:1,
          likes:1,
          views:1,
          status:1,
          postDate:1
        } 
      }
    ]);
  
    res.status(200).json({ status: true, post: post_details[0] });

};


const updatePostStatus = async (req, res) => { 

  const { id, status } = req.query;
  console.log(req.query);

  let post = await Posts.findById(id)
  post.status = status
  await post.save();

  res.status(200).json({status:true,message:'Status changed successfully!!'})

}



//////////////////////////////////////////////////////////////////

const fetchByCategory = (category, limit) => {
  return new Promise(async (res, rej) => {
    let match = category === "all" 
      ? { status:"PUBLIC" } 
      : { category: category, status:"PUBLIC"  };

    let posts = await Posts.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          newsHead: 1,
          newsBody: 1,
          category: 1,
          channelId: 1,
          images: 1,
          postDate: 1,
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
    ]);

    res(posts);
  });
};

const deletePostFiles = (images) => {
  
  let promises = [];

  images.forEach((file, i) => {
    promises.push(deleteFile(file));
  });

  Promise.all(promises)
    .then(async function () {
      return true
    })
    .catch(function (err) {
      return false
    });
}

module.exports = {
  addPosts,
  saveDraft,
  fetchHomeData,
  fetchNews,
  fetchDetails,
  postComment,
  deleteComment,
  likePost,
  deletePost,
  deleteDraft,
  getCategory,
  relatedPost,
  savePost,
  savedPosts,
  getNavLinks,
  updatePostText,
  updatePostCategory,
  updatePostIsComment,
  updatePostIsMonetize,
  translatePost,
  fetchPosts,
  getSelectedPost,
  updatePostStatus
};
