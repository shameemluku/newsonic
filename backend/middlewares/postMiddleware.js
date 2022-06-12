const User = require("../models/user");
const Posts = require("../models/posts");
const ObjectId = require("mongodb").ObjectID;
const asyncHandler = require("express-async-handler");

const isLiked = asyncHandler(async (req, res, next) => {
  const { userId, type } = req.identity;

  if (type === "USER_ID") {
    let response = await Posts.findOne({
      _id: ObjectId(req.params.id),
      likes: ObjectId(userId),
    });
    if (response) {
      req.isLiked = true;
      next();
    } else {
      req.isLiked = false;
      next();
    }
  } else {
    next();
  }
});

const isSaved = asyncHandler(async (req, res, next) => {
  const { userId, type } = req.identity;

  if (type === "USER_ID") {
    let response = await User.findOne({
      _id: ObjectId(userId),
      saved: ObjectId(req.params.id),
    });
    if (response) {
      req.isSaved = true;
      next();
    } else {
      req.isSaved = false;
      next();
    }
  } else {
    next();
  }
});

module.exports = {
  isLiked,
  isSaved,
};
