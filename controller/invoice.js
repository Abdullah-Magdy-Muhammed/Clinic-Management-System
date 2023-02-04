const { request, response } = require("express");
const { default: mongoose } = require("mongoose");
require("./../model/invoice");

const InvoiceSchema = mongoose.model("invoice");

exports.getAllinvoice = (request, response, next) => {

    response.status(200).json(response.advancedResults)
}


exports.addInvoice = (request, response, next) => {
    let newInvoice = new InvoiceSchema({
        _id: request.body.id,
        paymentType: request.body.paymentType,
        totalCost: request.body.totalCost,
        date: request.body.date,
        doctor: request.body.doctor,
        Patient: request.body.Patient,
    })
    newInvoice.save()
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => next(error))
}

exports.updateInvoice = (request, response, next) => {
    InvoiceSchema.updateOne({
        _id: request.body.id,
    }, {
        $set: {
            paymentType: request.body.paymentType,
            totalCost: request.body.totalCost,
            date: request.body.date,
            doctor: request.body.doctor,
            Patient: request.body.Patient,
        }
    })
        .then(result => {
            if (result.matchedCount == 0) {
                throw new Error("This invoice is not found");
            } else if (result.modifiedCount == 0) {
                response.status(200).json({ "message": "No update Occured" })
            } else {
                response.status(200).json({ "message": "Invoice is updated" })
            }
        })
        .catch(error => next(error))
}
exports.getInvoiceByID = (request, response, next) => {
    InvoiceSchema.findById(request.params.id)
        .then((data) => {
            response.status(200).json(data)
        })
        .catch(error => next(error))
}
exports.deleteInvoiceByID = (request, response, next) => {
    InvoiceSchema.findByIdAndDelete(request.params.id)
        .then((result) => {
            if (result != null) {
                response.status(200).json({ "message": "This Invoice is deleted" })
            } else {
                throw new Error("This Invoice is not exist")
            }
        })
        .catch(error => next(error))
}