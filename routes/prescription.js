const express = require("express");
const { body ,param} = require("express-validator");
const prescriptionController = require("../controller/prescription");
const router = express.Router();
const validator = require("../middlewares/errorValidation");
const validation = require("./../middlewares/validations");
const vprescription = require("../middlewares/prescription");
const allowedUsers =require("./../middlewares/AuthorizeRole");

router
  .route("/prescription")
  .get(prescriptionController.getAllrecriptiondata) 
  .post(vprescription,validator,prescriptionController.addrecriptiondata ) 
  



  router.route("/prescription/:id")
  .get(validation.paramIdInt,validator,
  prescriptionController.getprecriptionByID)


.patch(
  validation.paramIdInt,
  validator,prescriptionController.updaterecriptionId
)


  .delete(validation.paramIdInt,
  validator, prescriptionController.deleteprecriptionByID)


module.exports = router;