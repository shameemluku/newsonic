const asyncHandler = require("express-async-handler");
const Channel = require("../models/channels");
const User = require("../models/user");
const Posts = require("../models/posts");
const ObjectId = require("mongodb").ObjectID;
const Revenues = require("../models/revenues");
const Transactions = require("../models/transactions");
const Payouts = require("../models/payouts");
const Drafts = require("../models/drafts");
const mime = require("mime-types");
const { uploadFile, uploadBaseFile } = require("../config/s3");

// @desc    Create a channel
// @rout    POST /api/channel/create
const createChannel = asyncHandler(async (req, res) => {
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
});

// @desc    Get channel details
// @rout    GET /api/channel/get-details
const getChannelDetails = asyncHandler(async (req, res) => {
  let userId = req.body.decodeId;
  let details = await Channel.findOne({ userId: ObjectId(userId) });
  res.status(200).json({ channelDetails: details });
});

// @desc    Get channel posts
// @rout    GET /api/channel/fetch-added-posts
const getAddedPosts = asyncHandler(async (req, res) => {
  const { channel: channelId, filter, limit } = req.query;
  let added_posts;

  if (filter === "ALL") {
    added_posts = await Posts.find({ channelId: ObjectId(channelId) }).sort({
      _id: -1,
    });
  } else if (filter === "DRAFT") {
    added_posts = await Drafts.aggregate([
      {
        $match: {
          channelId: ObjectId(channelId),
        },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $sort: { _id: -1 },
      },
    ]);
    added_posts.image = [];
    added_posts.seenBy = [];
    added_posts.likes = [];
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
});

// @desc    Get channel dashboard data
// @rout    GET /api/channel/get-dashdata
const getDashData = asyncHandler(async (req, res) => {
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

  let withdrawable = await Revenues.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
        isPaid: true,
        isWithdrawn: false,
      },
    },
    { $group: { _id: "", amount: { $sum: "$amount" } } },
  ]);

  withdrawable = withdrawable.length === 0 ? 0.0 : withdrawable[0]?.amount;

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
});

// @desc    Get Creator post details
// @rout    GET /api/channel/get-full-post
const getCreatorPostDetails = asyncHandler(async (req, res) => {
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

  const revenue_details = await Revenues.aggregate([
    { $match: { postId: ObjectId(postId) } },
    {
      $group: { _id: "$revType", sum: { $sum: "$amount" } },
    },
  ]);

  let combined = {};
  revenue_details.map((val) => {
    combined[val._id] = val.sum.toFixed(3);
  });

  if (combined?.CPI) {
    combined.total = combined?.CPC
      ? parseFloat(combined?.CPC) + parseFloat(combined?.CPI)
      : parseFloat(combined?.CPI);
  }

  if (post_details.length === 0) {
    res.status(200).json({ status: true, post: {} });
  } else {
    post_details[0].comments =
      Object.keys(post_details[0]?.comments[0]).length === 0
        ? []
        : post_details[0]?.comments;
    post_details[0].revenue = combined;
    res.status(200).json({ status: true, post: post_details[0] });
  }
});

// @desc    Get creator transactions
// @rout    GET /api/channel/get-transactions
const getTransactionDetails = asyncHandler(async (req, res) => {
  const channelId = req.channelId;
  let transactions = await Transactions.find({
    channelId: ObjectId(channelId),
  });
  let withdrawable = await Revenues.aggregate([
    {
      $match: {
        channelId: ObjectId(channelId),
        isPaid: true,
        isWithdrawn: false,
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
});

// @desc    Request Payout
// @rout    PUT /api/channel/request-payout
const payoutRequest = asyncHandler(async (req, res) => {
  const channelId = req.channelId;
  const { amount, paypalId } = req.body;

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
});

// @desc    Cancel Payout
// @rout    DELETE /api/channel/cancel-payout
const cancelPayout = asyncHandler(async (req, res) => {
  const channelId = req.channelId;
  let delete_data = await Payouts.deleteMany({
    channelId: ObjectId(channelId),
    isPaid: false,
  });

  res.status(200).json({ status: true, message: "Payout request cancelled" });
});

// @desc    Update channel
// @rout    PATCH /api/channel/update-channel
const updateChannelData = asyncHandler(async (req, res) => {
  const channelId = req.channelId;
  let { phone, website, email, paymentAccount } = req.body;

  paymentAccount = paymentAccount === "" ? null : paymentAccount;

  let response = await Channel.updateOne(
    {
      _id: ObjectId(channelId),
    },
    {
      $set: {
        phone,
        website,
        email,
        paymentAccount,
      },
    }
  );

  res.status(200).json({ status: true, message: "Channel data Updated" });
});

// @desc    Update channel image
// @rout    PATCH /api/channel/update-channel-image
const updateChannelPic = asyncHandler(async (req, res) => {
  const channelId = req.channelId;
  let { propic } = req.body;

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
        image: proDetails,
      },
    }
  );

  res.status(200).json({ status: true, message: "Channel image updated" });
});

// @desc    Fetch all channels for admin
// @rout    GET /api/channel/fetch-channels
const fetchAllChannels = asyncHandler(async (req, res) => {
  const { skip, limit, status } = req.query;
  let match = {};

  if (status === "ALL") match = {};
  if (status === "APPROVED") match = { isApproved: true };
  if (status === "PENDING") match = { isApproved: false };
  if (status === "BLOCKED") match = { isBlocked: true };

  let channels = await Channel.aggregate([
    {
      $match: match,
    },
    {
      $sort: { _id: -1 },
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]);

  if ((await Channel.countDocuments()) === parseInt(skip))
    return res.status(200).json({
      channels,
      message: "No more to load",
    });

  res.status(200).json({ channels });
});

// @desc    Approve channel admin
// @rout    PATCH /api/channel/approve-channel
const approveChannel = asyncHandler(async (req, res) => {
  const { id } = req.query;
  let channel = await Channel.findById(id);
  channel.isApproved = true;
  channel.save();
  res.status(200).json({ message: "Operation successfull" });
});

// @desc    Block channel admin
// @rout    PATCH /api/channel/block-channel
const blockChannel = asyncHandler(async (req, res) => {
  const { id, status } = req.query;
  let channel = await Channel.findById(id);
  channel.isBlocked = status;
  channel.save();

  res.status(200).json({ message: "Operation successfull" });
});

module.exports = {
  createChannel,
  getChannelDetails,
  getAddedPosts,
  getDashData,
  getCreatorPostDetails,
  getTransactionDetails,
  payoutRequest,
  cancelPayout,
  approveChannel,
  updateChannelData,
  updateChannelPic,
  fetchAllChannels,
  blockChannel,
};
