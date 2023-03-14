const express = require("express");
const paymentController=require("./../controller/payment")
const router = express.Router();
const allowedUsers =require("./../middlewares/AuthorizeRole")

router.route('/paymentWithCard/:doctorId') /// /paymentwithcard
.post(paymentController.payment)

router.route('/paymentWithCash')
.post(paymentController.paymentWithCash)

module.exports=router;