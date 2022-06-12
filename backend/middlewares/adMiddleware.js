const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.checkUserType = asyncHandler(async (req, res, next) => {
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
