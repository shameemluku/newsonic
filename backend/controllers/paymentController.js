const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transactions = require("../models/transactions");
const Revenues = require("../models/revenues");
const Payouts = require("../models/payouts");
const ObjectId = require("mongodb").ObjectID;

// @desc    Get Razorpay key
// @rout    GET /api/payment/get-razor-key
const getRazorKey = asyncHandler(async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY });
});

// @desc    Create order
// @rout    POST /api/payment/create-order
const createOrder = asyncHandler(async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: parseInt(Math.round(req.body.amount)),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  if (!order) return res.status(500).send("Some error occured");
  res.status(200).json({ ...order, key: process.env.RAZORPAY_KEY });
});

// @desc    Verify Rayzor payment
// @rout    POST /api/payment/verify-payment
const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    decodeId: sponsorId,
  } = req.body;

  let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  hmac = hmac.digest("hex");

  if (hmac == razorpay_signature) {
    const newTransaction = Transactions({
      payId: razorpay_payment_id,
      date: new Date(),
      amount: amount / 100,
      type: "BILLPAY",
      method: "RAZOR",
      sponsorId,
    });

    await newTransaction.save();

    await Revenues.updateMany(
      { sponsorId: ObjectId(sponsorId) },
      { $set: { isPaid: true } }
    );

    res.status(200).json({
      status: true,
      message: "Payment Successfull",
      tranId: newTransaction._id,
    });
  } else {
    res.status(400).json({ status: false, message: "Payment Failed" });
  }
});

// @desc    Fetch payouts by admin
// @rout    GET /api/payment/fetch-payouts
const fetchPayouts = asyncHandler(async (req, res) => {
  const { skip, limit, filter } = req.query;
  let match = {};
  let test;

  if (filter === "ALL") match = {};
  if (filter === "PAID") match = { isPaid: true };
  if (filter === "PENDING") match = { isPaid: false };

  let payouts = await Payouts.aggregate([
    {
      $match: match,
    },
    {
      $sort: { _id: -1 },
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]);

  if (
    (await Payouts.countDocuments()) === parseInt(skip) &&
    parseInt(skip) !== 0
  )
    return res.status(200).json({
      payouts,
      message: "No more to load",
    });

  res.status(200).json({ payouts });
});

// @desc    Approve payout by admin
// @rout    PATCH /api/payment/approve-payout/
const approvePayout = asyncHandler(async (req, res) => {
  const { payoutId } = req.params;
  const { payment_id, channelId, amount } = req.body;

  let payout = await Payouts.findById(payoutId);
  payout.isPaid = true;
  await payout.save();

  const newTransaction = Transactions({
    payId: payment_id,
    date: new Date(),
    amount,
    type: "PAYOUT",
    method: "PAYPAL",
    channelId,
  });
  await newTransaction.save();

  await Revenues.updateMany(
    { channelId: ObjectId(channelId) },
    { $set: { isWithdrawn: true } }
  );

  res
    .status(200)
    .json({ status: true, message: "Payout approved successfully" });
});

// @desc    Fetch transactions
// @rout    GET /api/payment/fetch-transactions
const fetchTransactions = asyncHandler(async (req, res) => {
  const { skip, limit, type } = req.query;
  const { decodeId: id } = req.body;
  let match = {
    type: "BILLPAY",
    sponsorId: ObjectId(id),
  };

  let transactions = await Transactions.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        _id: 1,
        payId: 1,
        amount: 1,
        date: 1,
      },
    },
    {
      $sort: { _id: -1 },
    },
    { $skip: parseInt(skip) },
    { $limit: parseInt(limit) },
  ]);

  if (
    (await Transactions.countDocuments(match)) === parseInt(skip) &&
    parseInt(skip) !== 0
  ) {
    return res.status(200).json({
      transactions,
      isEnd: true,
      message: "No more to load",
    });
  }

  res.status(200).json({ transactions });
});

// @desc    Get paypal ID
// @rout    GET /api/admin/get-paypal-id
const getPaypalId = asyncHandler((req, res) => {
  res.status(200).json({ status: true, paypalId: process.env.PAYPAI_ID });
});

module.exports = {
  getRazorKey,
  createOrder,
  verifyPayment,
  fetchPayouts,
  getPaypalId,
  approvePayout,
  fetchTransactions,
};
