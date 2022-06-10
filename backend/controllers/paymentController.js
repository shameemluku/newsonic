const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transactions = require("../models/transactions");
const Revenues = require("../models/revenues");
const Payouts = require("../models/payouts");
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

// const payOrder = async (req, res) => {
//   try {
//     const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
//       req.body;

//     // const newOrder = Order({
//     //   isPaid: true,
//     //   amount: amount,
//     //   razorpay: {
//     //     orderId: razorpayOrderId,
//     //     paymentId: razorpayPaymentId,
//     //     signature: razorpaySignature,
//     //   },
//     // });
//     // await newOrder.save();

//     res.send({
//       msg: "Payment was successfull",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// };

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

const fetchPayouts = async (req, res) => {
  const {skip,limit,filter} = req.query
    let match={};
    let test;

    if(filter==='ALL') match = {}
    if(filter==='PAID') match = { isPaid:true }
    if(filter==='PENDING') match = { isPaid:false }

    let payouts = await Payouts.aggregate([
        {
          $match: match,
        },
        {
            $sort: { _id: -1 },
        },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
    ])

    
    if(await Payouts.countDocuments() === parseInt(skip) && parseInt(skip)!==0) return  res.status(200).json({
        payouts, 
        message:"No more to load"
    })

    res.status(200).json({payouts})
}

const approvePayout = async (req,res) => {
  const {payoutId} = req.params;
  const {payment_id,channelId,amount} = req.body;

  let payout = await Payouts.findById(payoutId)
  payout.isPaid = true;
  await payout.save()

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


  res.status(200).json({status:true, message:"Payout approved successfully"})

}

const fetchTransactions = async (req, res) => {
  const { skip, limit, type } = req.query;
  console.log(req.query);
  const { decodeId:id } = req.body;
  let match = {
    type:'BILLPAY',
    sponsorId:ObjectId(id) 
  };

  // if (filter === "ALL") match = {};
  // if (filter === "BLOCKED") match = { isBlocked: true };
  // if (filter === "CREATOR") match = { isCreator: true };

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

  if ((await Transactions.countDocuments(match)) === parseInt(skip) && parseInt(skip)!==0){
    return res.status(200).json({
      transactions,
      isEnd:true,
      message: "No more to load",
    });
  }
    

  res.status(200).json({ transactions });
};

const getPaypalId = (req,res) => {
  res.status(200).json({status:true, paypalId:process.env.PAYPAI_ID})
}


module.exports = {
  getRazorKey,
  createOrder,
  verifyPayment,
  fetchPayouts,
  getPaypalId,
  approvePayout,
  fetchTransactions
};
