const express = require("express");
const router = express.Router();
const {
  getRazorKey,
  createOrder,
  verifyPayment,
  fetchTransactions,
} = require("../controllers/paymentController");

const { 
  isUserValid, 
  isCreator 
} = require("../middlewares/authMiddleware");

router.get("/get-razor-key", getRazorKey);
router.post("/create-order", createOrder);
router.post("/verify-payment", isUserValid, verifyPayment);
router.get("/fetch-transactions", isUserValid, fetchTransactions);

module.exports = router;
