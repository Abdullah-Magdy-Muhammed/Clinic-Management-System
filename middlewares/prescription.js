const {body}=require("express-validator") ;
const prescription=[
  // body("id").optional().isNumeric()
  // .withMessage("fName Shoud be string"),
    body("date").isDate().withMessage("lnvalid date"),
    body("doctorId").isNumeric().withMessage("docname shold be string"),
    body("patientId").isNumeric().withMessage("invalid patient name"),
    body("medicine").isArray().withMessage("Medicine should be array"),
    body("description").isString().withMessage("description should be string")
  ] ;
 
  module.exports = prescription;