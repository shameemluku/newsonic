const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Channel = require("../models/channels");
const Ads = require("../models/ad");
const ObjectId = require("mongodb").ObjectID;
const axios = require("axios");
const { 
  uploadBaseFile, 
  deleteFile 
} = require("../config/s3");

// @desc  Creating a User
// @rout  POST /api/user/signup
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, type, phone } = req.body;
  let result;

  if (type === "normal") {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    result = await User.create({
      email,
      password: hashedPassword,
      name: name,
      phone: phone,
      type: "normal",
    });
  } else {
    const user = await User.findOne({ email, type: "google" });
    if (user) {
      if (user.isBlocked)
        return res
          .status(401)
          .json({ message: "Your account is blocked by admin" });
      result = user;
    } else {
      const user = await User.findOne({ email });
      if (user)
        return res.status(400).json({
          message: "An Account is already created using this email",
        });
      result = await User.create({
        email,
        name: name,
        phone: null,
        type: "google",
      });
    }
  }

  const token = jwt.sign(
    { email: result.email, id: result._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const user = Object.assign({}, result._doc);

  // delete user._id;
  // delete user.isCreator;
  // delete user.isBlocked;
  user?.password && delete user?.password;
  res.cookie("security", token, {
    httpOnly: true,
    signed: true,
    maxAge: 900000,
  });
  res.status(200).json({ user });
});

// @desc  Logging user
// @rout  POST /api/user/signin
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User does not exist!" });
  if (user?.type === "google")
    return res.status(400).json({ message: "User is a google user" });
  if (user?.isBlocked)
    return res
      .status(404)
      .json({ message: "Your account is blocked by admin" });

  const isPassValid = await bcrypt.compare(password, user.password);

  if (isPassValid) {
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    delete user.password;
    res.cookie("security", token, {
      httpOnly: true,
      signed: true,
      maxAge: 900000,
    });
    res.status(200).json({ user });
  } else {
    res.status(400).json({ message: "Invalid Credentials" });
  }
});

// @desc  verify a user
// @rout  GET /api/user/verify
const verifyUser = asyncHandler(async (req, res) => {
  const tokenId = req.body.decodeId;
  const user = await User.findOne({ _id: ObjectId(tokenId) });

  if (user) {
    if (user.isBlocked) {
      return res.status(401).json({
        message: "Your account is blocked by admin",
        type: "BLOCKED",
      });
    }

    user.token = req.body.token;
    res.status(200).json({ user });
  } else {
    res.status(404).json({ 
      status: false,
      type:'USER_NOT_FOUND' 
    });
  }
});

// @desc  fetch user profile
// @rout  GET /api/user/fetch-profile
const getUserProfile = asyncHandler(async (req, res) => {
  const id = req.body.decodeId;
  let channel = await Channel.findOne(
    { userId: ObjectId(id) },
    { name: 1, image: 1, isApproved: 1 }
  );
  let adCount = await Ads.countDocuments({ sponsorId: ObjectId(id) });
  let savedPosts = await User.findOne({ _id: ObjectId(id) }).populate(
    "saved",
    "_id newsHead newsBody images"
  );

  res.status(200).json({
    status: true,
    channel,
    adCount,
    savedPosts: savedPosts?.saved,
  });
});

// @desc  Change user dp
// @rout  PATCH /api/user/change-dp
const changeDp = asyncHandler(async (req, res) => {
  const { image, decodeId: id } = req.body;

  let buffer = Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const user = await User.findById(id);
  await deleteFile(user.image);

  let data = {
    Key: `userpic-${id}-${Math.floor(1000 + Math.random() * 9000)}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  let proDetails = await uploadBaseFile(data);

  const update_result = await User.findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: {
        image: proDetails,
      },
    }
  );

  res
    .status(200)
    .json({ status: true, message: "User profile updated!", key: proDetails });
});


// @desc  Remove user dp
// @rout  PATCH /api/user/remove-dp
const removeDp = asyncHandler(async (req, res) => {
  const { decodeId: id } = req.body;
  const user = await User.findById(id);
  await deleteFile(user.image);
  res
    .status(200)
    .json({ status: true, message: "Removed image successfully!" });
});

// @desc  Change name
// @rout  PATCH /api/user/change-name
const changeName = asyncHandler(async (req, res) => {
  const { decodeId: id, name } = req.body;
  const user = await User.findById(id);
  user.name = name;
  await user.save();
  res.status(200).json({ status: true, message: "Name changed successfully" });
});

// @desc  Change password
// @rout  PATCH /api/user/change-password
const changePhone = asyncHandler(async (req, res) => {
  const { decodeId: id, phone } = req.body;
  const user = await User.findById(id);
  user.phone = phone;
  await user.save();
  res.status(200).json({ status: true, message: "Phone changed successfully" });
});

// @desc  Change phone
// @rout  PATCH /api/user/change-phone
const changePassword = asyncHandler(async (req, res) => {
  const { decodeId: id, newPassword, oldPassword } = req.body;
  const user = await User.findById(id);

  const isPassValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPassValid) {
    return res
      .status(400)
      .json({ status: false, message: "Old Password not matching" });
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return res
      .status(400)
      .json({ status: false, message: "New password cannot be same as old" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();
  res
    .status(200)
    .json({ status: true, message: "Password changed successfully" });
});

// @desc  Signout user
// @rout  POST /api/user/signout
const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).clearCookie("security").send({});
});

// @desc  Fetch users for admin
// @rout  GET /api/admin/fetch-users
const fetchUsers = asyncHandler(async (req, res) => {
  const { skip, limit, filter } = req.query;
  let match = {};
  let test;

  if (filter === "ALL") match = {};
  if (filter === "BLOCKED") match = { isBlocked: true };
  if (filter === "CREATOR") match = { isCreator: true };

  let users = await User.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        type: 1,
        phone: 1,
        isBlocked: 1,
        isCreator: 1,
      },
    },
    {
      $sort: { _id: -1 },
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]);

  if ((await User.countDocuments()) === parseInt(skip))
    return res.status(200).json({
      users,
      message: "No more to load",
    });

  res.status(200).json({ users });
});

// @desc  Fetch users for admin
// @rout  PATCH /api/admin/block-user
const blockUser = asyncHandler(async (req, res) => {
  const { id, status } = req.query;
  let user = await User.findById(id);
  user.isBlocked = status;
  user.save();

  res.status(200).json({ message: "Operation successfull" });
});

// @desc  Remove a user by admin
// @rout  DELETE /api/admin/remove-user
const removeUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  let response = await User.deleteOne({ _id: ObjectId(id) });
  if (response.deletedCount > 0) {
    res.status(200).json({ message: "Operation successfull" });
  }
});


const checkAvail = asyncHandler(async (req, res) => {
  const { name } = req.body;
  res.status(200).json({ status: true });
});

const getFinger = asyncHandler(async (req, res) => {
  const fpPromise = import("https://openfpcdn.io/fingerprintjs/v3").then(
    (FingerprintJS) => FingerprintJS.load()
  );

  FingerprintJS.load()
    .then((fp) => fp.get())
    .then((result) => {
      const visitorId = result.visitorId;
    });
});

const getIp = asyncHandler(async (req, res) => {
  res.json({
    ip: (await axios.get("https://geolocation-db.com/json/")).data?.IPv4,
  });
});

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  checkAvail,
  fetchUsers,
  blockUser,
  removeUser,
  logoutUser,
  getUserProfile,
  changeDp,
  removeDp,
  changeName,
  changePhone,
  changePassword,
  getIp,
  getFinger,
};
