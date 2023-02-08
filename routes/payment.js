const express = require("express");
const paymentController=require("./../controller/payment")
const router = express.Router();


router.route('/paymentWithCard/:doctorId') /// /paymentwithcard
.post(paymentController.payment)

router.route('/paymentWithCash/:doctorId')
.post(paymentController.paymentWithCash)

module.exports=router;