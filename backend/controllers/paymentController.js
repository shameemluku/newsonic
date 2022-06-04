const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transactions = require("../models/transactions");
const Revenues = require("../models/revenues");
const ObjectId = require("mongodb").ObjectID;

const getRazorKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY });
};

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    console.log(req.body.amount);

    const options = {
      amount: parseInt(Math.round(req.body.amount)),
      currency: "INR",
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.status(200).json({ ...order, key: process.env.RAZORPAY_KEY });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const payOrder = async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;

    // const newOrder = Order({
    //   isPaid: true,
    //   amount: amount,
    //   razorpay: {
    //     orderId: razorpayOrderId,
    //     paymentId: razorpayPaymentId,
    //     signature: razorpaySignature,
    //   },
    // });
    // await newOrder.save();

    res.send({
      msg: "Payment was successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
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
      amount: amount/100,
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
    console.log("Not Successss");
  }
};

module.exports = {
  getRazorKey,
  createOrder,
  verifyPayment,
};
