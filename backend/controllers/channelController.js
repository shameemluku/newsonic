const Channel = require("../models/channels");
const User = require("../models/user");
const Posts = require("../models/posts");
const ObjectId = require("mongodb").ObjectID;
const { uploadFile, uploadBaseFile } = require("../config/s3");
const mime = require("mime-types");
const Revenues = require("../models/revenues");
const Transactions = require("../models/transactions");
const Payouts = require("../models/payouts");

// @desc    Create a channel
// @rout    POST /api/channel/create
const createChannel = async (req, res) => {
  let result,
    filesArray = [];
  let userId = req.body.decodeId;

  const { channelName, phone, email, website, propic } = req.body;

  if (propic === "null") {
    res.status(400).json({ status: false });
    return;
  }

  result = await Channel.create({
    name: channelName,
    phone,
    email,
    userId,
    website,
  });

  // let ext = propic.match(/[^:/]\w+(?=;|,)/)[0];
  // let bufferObj = Buffer.from(propic, "base64");
  // let proDetails = await uploadFile(bufferObj,`propic-${result._id}.${ext}`)

  let buffer = Buffer.from(
    propic.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  let data = {
    Key: `propic-${result._id}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  let proDetails = await uploadBaseFile(data);

  if (Array.isArray(req.files.file)) {
    let promises = [];

    req.files.file.forEach((file, i) => {
      let ext = mime.extension(file.mimetype);
      promises.push(uploadFile(file.data, `channel-${result._id}-${i}.${ext}`));
    });

    Promise.all(promises)
      .then(async function (filesArray) {
        const update_result = await Channel.findOneAndUpdate(
          { _id: ObjectId(result._id) },
          {
            $set: {
              image: proDetails,
              supportFiles: filesArray,
            },
          }
        );
        await User.updateOne(
          { _id: ObjectId(userId) },
          { $set: { isCreator: true } }
        );
        res.status(200).json({ status: true, details: update_result });
      })
      .catch(function (err) {
        res.send(err.stack);
      });
  } else {
    let ext = mime.extension(req.files.file.mimetype);
    const { data, name } = req.files.file;
    filesArray.push(await uploadFile(data, `channel-${result._id}.${ext}`));

    const update_result = await Channel.findOneAndUpdate(
      { _id: ObjectId(result._id) },
      { $set: { image: proDetails, supportFiles: filesArray } }
    );
    await User.updateOne(
      { _id: ObjectId(userId) },
      { $set: { isCreator: true } }
    );
    res.status(200).json({ status: true, details: update_result });
  }
};

// @desc    Create a channel
// @rout    POST /api/channel/get-details

const getChannelDetails = async (req, res) => {
  let userId = req.body.decodeId;
  let details = await Channel.findOne({ userId: ObjectId(userId) });
  res.status(200).json({ channelDetails: details });
};

const getAddedPosts = async (req, res) => {
  const { channel: channelId, filter, limit } = req.query;
  let added_posts;

  console.log(limit);

  if (filter === "ALL") {
    added_posts = await Posts.find({ channelId: ObjectId(channelId) }).sort({
      _id: -1,
    });
  } else {
    added_posts = await Posts.aggregate([
      {
        $match: {
          channelId: ObjectId(channelId),
          status: filter,
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $sort: { _id: -1 },
      },
    ]);
  }

  res.status(200).json({ posts: added_posts });
};

const getDashData = async (req, res) => {
  const channelId = req.channelId;

  let most_liked = await Posts.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
      },
    },
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

  let most_viewed = await Posts.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
      },
    },
    { $addFields: { views: { $size: { $ifNull: ["$seenBy", []] } } } },
    { $addFields: { image: { $arrayElemAt: ["$images", 0] } } },
    {
      $project: { _id: 1, newsHead: 1, views: 1, image: 1 },
    },
    {
      $sort: { views: -1 },
    },
    { $limit: 10 },
  ]);

  let interactionCount = await Posts.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
      },
    },
    { $addFields: { views: { $size: { $ifNull: ["$seenBy", []] } } } },
    { $addFields: { likes: { $size: { $ifNull: ["$likes", []] } } } },
    {
      $group: {
        _id: null,
        viewsCount: { $sum: "$views" },
        likesCount: { $sum: "$likes" },
      },
    },
  ]);

  let adPostCount = await Posts.countDocuments({
    channelId: ObjectId(channelId),
    isMonetize: true,
  });
  let totalPosts = await Posts.countDocuments({
    channelId: ObjectId(channelId),
  });

  let Earnings = await Revenues.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
      },
    },
    { $group: { _id: "$isPaid", amount: { $sum: "$amount" } } },
  ]);

  let totalEarnings =
    Earnings.length === 2
      ? Earnings[0]?.amount + Earnings[1]?.amount
      : Earnings[0]?.amount;

  let withdrawable = 0;

  Earnings.map((val) => {
    if (val._id) withdrawable = val.amount;
  });

  res.status(200).json({
    most_liked,
    most_viewed,
    view_count: interactionCount[0]?.viewsCount,
    likes_count: interactionCount[0]?.likesCount,
    monetized_posts: adPostCount,
    total_posts: totalPosts,
    withdrawable,
    total_earning: totalEarnings,
  });
};

const getCreatorPostDetails = async (req, res) => {
  const postId = req.query.postid;
  const channelId = req.channelId;

  let post_details = await Posts.aggregate([
    {
      $match: {
        _id: ObjectId(postId),
        channelId: ObjectId(channelId),
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
  ]);

  if (post_details.length === 0) {
    res.status(200).json({ status: true, post: {} });
  } else {
    post_details[0].comments =
      Object.keys(post_details[0]?.comments[0]).length === 0
        ? []
        : post_details[0]?.comments;
    res.status(200).json({ status: true, post: post_details[0] });
  }
};

const getTransactionDetails = async (req, res) => {
  const channelId = req.channelId;
  let transactions = await Transactions.find({
    channelId: ObjectId(channelId),
  });
  let withdrawable = await Revenues.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
        isPaid: true,
      },
    },
    { $group: { _id: "", amount: { $sum: "$amount" } } },
  ]);
  let payout = await Payouts.findOne({
    channelId: ObjectId(channelId),
    isPaid: false,
  });
  let isRequested = payout ? true : false;
  res.status(200).json({
    status: true,
    transactions,
    amount: withdrawable[0]?.amount,
    isRequested,
    prevAmount: payout?.amount,
  });
};

const payoutRequest = async (req, res) => {
  try {
    const channelId = req.channelId;
    const { amount, paypalId } = req.body;

    console.log(paypalId);

    let withdrawable = await Revenues.aggregate([
      {
        $match: {
          channelId: ObjectId(channelId),
          isPaid: true,
        },
      },
      { $group: { _id: "", amount: { $sum: "$amount" } } },
    ]);

    if (withdrawable[0].amount !== amount) {
      return res.status(404).json({ message: "Invalid Amount" });
    }

    let payout = await Payouts.create({
      amount,
      channelId,
      date: new Date(),
      paypalId,
    });

    res.status(200).json({ status: true, message: "Payout request sent" });
  } catch (error) {
    console.log(error);
  }
};

const cancelPayout = async (req, res) => {
  try {

    const channelId = req.channelId;
    let delete_data = await Payouts.deleteMany({
      channelId:ObjectId(channelId),
      isPaid:false
    })

    res.status(200).json({ status: true, message: "Payout request cancelled" });

  } catch (error) {
    console.log(error);
  }
} 

const updateChannelData = async (req, res) => {
  try {

    const channelId = req.channelId;
    let { phone, website, email, paymentAccount } = req.body
    
    paymentAccount = (paymentAccount === "") ? null : paymentAccount

    let response = await Channel.updateOne({
      _id:ObjectId(channelId)
    },
    {
      $set:{
        phone,
        website,
        email,
        paymentAccount
      }
    }
    )

    console.log(response);

    res.status(200).json({ status: true, message: "Channel data Updated" });

  } catch (error) {
    console.log(error);
  }
} 


const updateChannelPic = async (req, res) => {
  try {
    const channelId = req.channelId;
    let { propic } = req.body

    let buffer = Buffer.from(
      propic.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
  
    let data = {
      Key: `propic-${channelId}`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
  
    let proDetails = await uploadBaseFile(data);

    const update_result = await Channel.findOneAndUpdate(
      { _id: ObjectId(channelId) },
      {
        $set: {
          image: proDetails
        }
      }
    )

    res.status(200).json({ status: true, message: "Channel image updated" });

  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  createChannel,
  getChannelDetails,
  getAddedPosts,
  getDashData,
  getCreatorPostDetails,
  getTransactionDetails,
  payoutRequest,
  cancelPayout,
  updateChannelData,
  updateChannelPic
};
