const base64ToImage = require("base64-to-image");
const { uploadBaseFile } = require("../config/s3");
const User = require("../models/user");
const Posts = require("../models/posts");
const ObjectId = require("mongodb").ObjectID;

// @desc    Creating a Brands
// @rout    POST /api/coupons
const getPosts = async (req, res) => {
  let posts = await Posts.aggregate([
    {
      $lookup: {
        from: "channels",
        localField: "channelId",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.status(200).json(posts);
};

// @desc    Creating a Brands
// @rout    POST /api/coupons
const addPosts = async (req, res) => {
  let { newsHead, newsBody, category, comment, monetize, channelId } = req.body;

  let channel_result = await Posts.create({
    newsHead,
    newsBody,
    channelId: new ObjectId(channelId),
    category,
    isComment: comment,
    isMonetize: monetize,
    postDate: new Date(),
  });

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

const fetchNews = async (req, res) => {
  let { limit } = req.query;
  let { category } = req.params;

  let match = category === "all" ? {} : { category: category };

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
  ]);

  console.log(posts);
  res.json(posts);
};

const fetchDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let post_details = await Posts.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
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
        },
      },
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
    res.status(400).json({ error:"Internal Error", message:error.message });
  }
};
 

const postComment = async (req, res) => {
  console.log("Here");
  console.log(req.body);
}

module.exports = {
  getPosts,
  addPosts,
  fetchNews,
  fetchDetails,
  postComment
};
