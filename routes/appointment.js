const express= require("express");
const mongoose = require('mongoose');
const controller = require("./../controller/appointment");
const validator = require("./../middlewares/errorValidation");
const validation = require("./../middlewares/validations");
const advancedResults = require ("./../middlewares/advancedResult");
const allowedUsers =require("./../middlewares/AuthorizeRole");

require('./../model/appointment');
const appointment= mongoose.model('appointment');
const router = express.Router({caseSensitive:false});


router.route("/")
.get(advancedResults(appointment),controller.getAppointment)
.post(validation.appointmentPost,validator,controller.createAppointment)


router.route("/:id")
.get(controller.getAppointment)
.delete(validation.paramIdInt,validator, controller.deleteAppointment)
.patch(validation.appointmentUpdate,validator,controller.updateAppointment)



module.exports=router;