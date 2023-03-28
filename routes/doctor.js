const express = require("express");
const validator = require("../middlewares/errorValidation");
const validation = require("../middlewares/validations")
const controller = require("../controller/doctor");
const calenderRouter = require("./doctorsCalender");
const appointmentRouter = require("./appointment");
const allowedUsers =require("./../middlewares/AuthorizeRole");

require('./../model/doctor');

const mongoose = require('mongoose');
const advancedResults = require("../middlewares/advancedResult");
const { request } = require("express");
const doctors = mongoose.model('doctors');
const router = express.Router();

router.use('/doctors/:doctorId/calender',controller.reRoute, calenderRouter)
router.use('/doctors/:doctorId/appointment', controller.reRoute, appointmentRouter)


router.route("/doctors")
      .get(advancedResults(doctors,{ path: "clinicId", select: { _id: 1, name: 1 } }), controller.getAllDoctors)

router.route("/doctors/:id")
      .get(validation.paramIdInt,validator, controller.getDoctorById)
      .patch(validation.updateDoctor, validator, controller.updateDoctor)
      .delete(validation.paramIdInt,validator, controller.deleteDoctor)

router.route("/doctors/:id/status")
.patch(validation.updateStatus,validator,controller.updateDoctorStatus)
            
module.exports = router;
