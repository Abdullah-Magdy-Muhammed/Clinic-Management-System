const express = require("express");
const router = express.Router({ caseSensitive: false });
const controller = require("./../controller/invoice");
const validator = require("./../middlewares/errorValidation");
const expressValidation = require("./../middlewares/validations")
const mongoose = require('mongoose');

const advancedResults = require("./../middlewares/advancedResult");
const allowedUsers = require("./../middlewares/AuthorizeRole");

const invoice = mongoose.model('invoice');

router.route("/")
    .get(advancedResults(invoice, [{ path: "doctor", select: { _id: 0, name: 1 } }, { path: "patient", select: { _id: 0, name: 1 } }]), controller.getAllinvoice)



router.route("/invoice")
    .get(advancedResults(invoice,[{ path:"doctor" , select: { _id:0 , name:1 }},{ path:"patient" , select: { _id:0, name:1 } }]), controller.getAllinvoice)
    .post(expressValidation.invoicePost, validator, controller.addInvoice)



router.route("/invoice/:id")
    .get(validator, controller.getInvoiceByID)

    .patch(expressValidation.invoiceUpdate, validator, controller.updateInvoice)

router.delete("/invoice/:id",

    validator, controller.deleteInvoiceByID)


module.exports = router;
