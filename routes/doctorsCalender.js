const express = require("express");
const router = express.Router();
const validator = require("./../middlewares/errorValidation");
const controller = require("./../controller/calender");
const validation=require("./../middlewares/validations");
const mongoose = require('mongoose');
const advancedResults = require ("./../middlewares/advancedResult");
require('../model/doctorCalender');
 const calender= mongoose.model('calender');
 const allowedUsers =require("./../middlewares/AuthorizeRole");


router.route("/")
  .get(advancedResults(calender),controller.getCalenders)
  .post(validation.calenderPost,validator, controller.createCalender)



router.route("/:id")
  .get(validation.paramIdInt,validator,controller.getCalender)
  .delete(validation.paramIdInt,validator,controller.deleteCalender)


module.exports = router;
