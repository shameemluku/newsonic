const jwt = require("jsonwebtoken");
const { decode } = require("jsonwebtoken");
const requestIp = require("request-ip");
const axios = require("axios");
const Channel = require("../models/channels");
const ObjectId = require("mongodb").ObjectID;
const asyncHandler = require("express-async-handler");

exports.isUserValid = asyncHandler((req, res, next) => {
  const token = req.signedCookies.security;
  let decodedData;

  if (token) {
    decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedData) {
      req.body.decodeId = decodedData?.id;
      req.body.token = token;
      next();
    }
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});

exports.getIp = async (req, res, next) => {
  let ip = (await axios.get("https://geolocation-db.com/json/")).data?.IPv4;
  next();
};

exports.isRead = asyncHandler(async (req, res, next) => {
  const token = req.signedCookies.security;
  const { signature } = req.query;

  if (token) {
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedData) {
      req.identity = {
        userId: decodedData?.id,
        type: "USER_ID",
      };
      next();
    } else {
      req.identity = {
        userId: signature,
        type: "SIGN_USER",
      };
      next();
    }
  } else {
    req.identity = {
      userId: signature,
      type: "SIGN_USER",
    };
    next();
  }
});

exports.isCreator = asyncHandler(async (req, res, next) => {
  const { channel } = req.query;
  if (channel) {
    let details = await Channel.findOne({
      userId: ObjectId(req.body.decodeId),
      _id: ObjectId(channel),
    });

    if (details?.isBlocked) return res.status(403).json({ type: "CHANNEL" });

    if (details) {
      req.channelId = channel;
      next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "Not authorized" });
    next();
  }
});

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const token = req.signedCookies.security2;

  if (token) {
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedData) {
      req.body.decodeId = decodedData?.id;
      req.body.token = token;
      next();
    }
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});
