
const express= require("express");
const mongoose = require('mongoose');
const controller = require("./../controller/report");
const validator = require("./../middlewares/errorValidation");
const advancedResults = require ("./../middlewares/advancedResult");
const { route } = require("./invoice");
const allowedUsers =require("./../middlewares/AuthorizeRole");


const router = express.Router();

router.route("/appointmentreport")
.get(controller.getAllreport)

router.route("/appointmentreportjson")
.get(controller.jsonReport)


router.route("/appointmentreport/:date")
.get(controller.getDailyreport)



module.exports=router;