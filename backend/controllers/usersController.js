const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Channel = require("../models/channels");
const Ads = require("../models/ad");
const ObjectId = require("mongodb").ObjectID;
const { uploadBaseFile, deleteFile } = require("../config/s3");
const axios = require("axios");

// @desc  Creating a User
// @rout  POST /api/register
const registerUser = async (req, res) => {
  const { name, email, password, type, phone } = req.body;
  let result;

  try {
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
          return res
            .status(400)
            .json({
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

    console.log(user);

    res.cookie("security", token, {
      httpOnly: true,
      signed: true,
      maxAge: 900000,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

// @desc  Logging User
// @rout  POST /api/login
const loginUser = async (req, res) => {
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
};

const verifyUser = async (req, res) => {
  const tokenId = req.body.decodeId;
  // console.log(req.cookies.cookieName);

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
    res.status(404).json({ status: false });
  }
};

const getUserProfile = async (req, res) => {

  const id = req.body.decodeId;
  let channel = await Channel.findOne(
    { userId: ObjectId(id) },
    { name: 1, image: 1, isApproved: 1 }
  );
  let adCount = await Ads.countDocuments({sponsorId:ObjectId(id)})
  let savedPosts = await User.findOne({ _id: ObjectId(id) }).populate(
    "saved",
    "_id newsHead newsBody images"
  );


  res.status(200).json({
      status:true,
      channel,
      adCount,
      savedPosts:savedPosts?.saved
  })

};

const changeDp = async (req, res) => {

    const { image, decodeId:id} = req.body;

    let buffer = Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const user = await User.findById(id)
    await deleteFile(user.image)
    
    let data = {
      Key: `userpic-${id}-${Math.floor(1000+Math.random()*9000)}`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    let proDetails = await uploadBaseFile(data);
    
    
    const update_result = await User.findOneAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: {
        image: proDetails
      }
    })

  
    res.status(200).json({ status: true, message: "User profile updated!", key:proDetails });
    
}

const removeDp = async (req, res) => {
  
  const { decodeId:id} = req.body;
  const user = await User.findById(id)
  await deleteFile(user.image)
  res.status(200).json({ status: true, message: "Removed image successfully!"});

}

const changeName = async (req, res) => {
  
  const { decodeId:id,  name} = req.body;
  const user = await User.findById(id)
  user.name = name
  await user.save()
  res.status(200).json({ status: true, message: "Name changed successfully"});

}

const changePhone = async (req, res) => {
  
  const { decodeId:id,  phone} = req.body;
  const user = await User.findById(id)
  user.phone = phone
  await user.save()
  res.status(200).json({ status: true, message: "Phone changed successfully"});

}

const changePassword = async (req, res) => {
  
  const { decodeId:id, newPassword, oldPassword } = req.body;
  const user = await User.findById(id)

  const isPassValid = await bcrypt.compare(oldPassword, user.password);
  if(!isPassValid){ return res.status(400).json({ status: false, message: "Old Password not matching"}); }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if(isSamePassword){ return res.status(400).json({ status: false, message: "New password cannot be same as old"}); }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword
  await user.save()
  res.status(200).json({ status: true, message: "Password changed successfully"});

}


const logoutUser = async (req, res) => {
  res.status(200).clearCookie("security").send({});
};

const fetchUsers = async (req, res) => {
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
};

const blockUser = async (req, res) => {
  const { id, status } = req.query;
  let user = await User.findById(id);
  user.isBlocked = status;
  user.save();

  res.status(200).json({ message: "Operation successfull" });
};

const removeUser = async (req, res) => {
  const { id } = req.query;
  let response = await User.deleteOne({ _id: ObjectId(id) });
  if (response.deletedCount > 0) {
    res.status(200).json({ message: "Operation successfull" });
  }
};

const checkAvail = async (req, res) => {
  const { name } = req.body;
  res.status(200).json({ status: true });
};

const getFinger = async (req, res) => {
  console.log("HERE");

  const fpPromise = import("https://openfpcdn.io/fingerprintjs/v3").then(
    (FingerprintJS) => FingerprintJS.load()
  );

  FingerprintJS.load()
    .then((fp) => fp.get())
    .then((result) => {
      const visitorId = result.visitorId;
      console.log(visitorId);
    });
};

const getIp = async (req, res) => {
  res.json({
    ip: (await axios.get("https://geolocation-db.com/json/")).data?.IPv4,
  });
};

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
