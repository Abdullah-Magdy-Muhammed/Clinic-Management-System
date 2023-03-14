const express = require("express");
const router = express.Router();
const controller = require("./../controller/clinic");
const validator = require("./../middlewares/errorValidation");
const expressValidation = require("./../middlewares/validations")
const mongoose = require('mongoose');
const allowedUsers = require("./../middlewares/AuthorizeRole");

const advancedResults = require("./../middlewares/advancedResult");
//  require('../model/clinic');
const clinic = mongoose.model('clinic');



router.route("/clinic")
    .get(advancedResults(clinic), controller.getAllclinics)
    .post(expressValidation.clinicPost, validator, controller.addClinic)

router.route("/clinic/:id")
    .get(validator, controller.getClinicByID)
    .delete(expressValidation.paramIdInt, validator, controller.deleteClinicByID)
    .patch(expressValidation.patientUpdate, validator, controller.updateClinic)

router.route("/clinic/:id/doctor")
    .get(expressValidation.paramIdInt, validator, controller.getDoctors)
    .post(expressValidation.paramIdInt, validator, controller.pushDoctors)
    .delete(expressValidation.paramIdInt, validator, controller.deleteDoctor)

router.route("/clinic/:id/medicien")
    .get(expressValidation.paramIdInt, validator, controller.getMedicien)
    .post(expressValidation.paramIdInt, validator, controller.pushMedicien)
    .delete(expressValidation.paramIdInt, validator, controller.deleteMedicien)

router.route("/clinic/:id/employee")
    .get(expressValidation.paramIdInt, validator, controller.getEmployees)
    .post(expressValidation.paramIdInt, validator, controller.pushEmployee)
    .delete(expressValidation.paramIdInt, validator, controller.deleteEmployee)

module.exports = router;

