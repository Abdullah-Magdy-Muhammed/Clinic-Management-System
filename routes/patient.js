const express = require("express");
const mongoose = require('mongoose');
const controller = require("./../controller/patient");
const validator = require("./../middlewares/errorValidation");
const validation = require("./../middlewares/validations");
const advancedResults = require("./../middlewares/advancedResult");
const allowedUsers = require("./../middlewares/AuthorizeRole");

require('./../model/patient');
const patient = mongoose.model('patient');

//include other resource routers
const appointmentRouter = require('./appointment');
const invoiceRouter = require('../routes/invoice');


const router = express.Router();


// Re-route into other resource routers 
router.use('/patient/:patientId/appointment', controller.newAppointment, appointmentRouter)
router.use('/patient/:patientId/invoice', controller.reRoute, invoiceRouter)

router.route("/patient")
    .get(advancedResults(patient), controller.getPatients)


router.route("/patient/:id")
    .get(validation.paramIdInt, validator, controller.getPatient)
    .delete(validation.paramIdInt, validator, controller.deletePatient)
    .patch(validation.patientUpdate, validator, controller.updatePatient)

router.route("/patient/:id/status")
    .patch(validation.updateStatus, validator, controller.updatepatientStatus)

module.exports = router;