const express = require("express");
const router = express.Router();
const {
  getRazorKey,
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const { isUserValid, isCreator } = require("../middlewares/auth");

router.get("/get-razor-key", getRazorKey);
router.post("/create-order", createOrder);
router.post("/verify-payment", isUserValid, verifyPayment);

module.exports = router;
