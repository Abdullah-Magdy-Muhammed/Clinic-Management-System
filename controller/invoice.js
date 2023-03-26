const { request, response } = require("express");
const { default: mongoose } = require("mongoose");
require("./../model/invoice");

const InvoiceSchema = mongoose.model("invoice");
const pdfKit = require("pdfkit");
let fs = require("fs");
exports.getAllinvoice = async (request, response, next) => {
    console.log("from invoice controller");
    let query;
    if (request.patientId) {
        query = InvoiceSchema.find({ patientId: request.patientId }).populate({ path: "doctor", select: { _id: 0, name: 1 } })
            .populate({ path: "patient", select: { _id: 0, name: 1 } })
        const invoice
            = await query;
        response.status(200).json({
            success: true,
            count: invoice
                .length,
            data: invoice

        })
    }
    else {
        response.status(200).json(response.advancedResults)
    }
}


exports.addInvoice = (request, response, next) => {
    let newInvoice = new InvoiceSchema({
        paymentType: request.body.paymentType,
        totalCost: request.body.totalCost,
        date: request.body.date,
        doctor: request.body.doctor,
        patient: request.body.patient,
        // small 
    })
    newInvoice.save()
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => next(error))
}

exports.updateInvoice = (request, response, next) => {
    InvoiceSchema.updateOne({
        _id: request.params.id,
    }, {
        $set: {
            paymentType: request.body.paymentType,
            totalCost: request.body.totalCost,
            date: request.body.date,
            doctor: request.body.doctor,
            patient: request.body.patient,
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
        //   .populate({ path: "patient", select: { name: 1, _id: 0 } })
        .then((data) => {
            createPdf(data)
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


function createPdf(data) {
    try {
        // let clinicLogo="./../Images/logo.jpg";
        let fileName = 'sample-invoice.pdf';
        let fontNormal = 'Helvetica';
        let fontBold = 'Helvetica-Bold';

        let clinicInfo = {
            "companyName": "Clinical Managment System",
            "address": "Central",
            "city": "Mansoura",
            "state": "Eldakahlya",
            "pincode": "400017",
            "country": "Egypt",
            "contactNo": "+910000000600"
        }
        let patientInfo = {
            "patientId": data.patient,
            "doctorId": data.doctor,
            "city": "Mansoura",
            "state": "Maharashtra",
            "pincode": "400054",
            "country": "Egypt",
            "contactNo": "+910000000787"
        }

        let orderInfo = {
            "orderNo": data._id,
            "paymentType": data.paymentType,
            "invoiceDate": data.date,
            "invoiceTime": "10:57:00 PM",
            "products": [
                {
                    "id": data._id,
                    "name": data.patient,
                    "docotrName": data.doctor,
                    "unitPrice": 150,
                    "totalPrice": data.totalCost,
                    // "qty": 1
                }
            ],
        }

        let pdfDoc = new pdfKit();

        let stream = fs.createWriteStream(fileName);
        pdfDoc.pipe(stream);

        pdfDoc.text("Clinical Managment System ", 5, 5, { align: "center", width: 600 });
        // pdfDoc.image(clinicLogo, 25, 20, { width: 50, height: 50 });
        pdfDoc.font(fontBold).text('PARALLELCODES', 7, 75);
        pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
        pdfDoc.fontSize(10).text('11-MAY-2021 10:24 PM', 400, 46, { width: 200 });

        pdfDoc.font(fontBold).text("by:", 7, 100);
        pdfDoc.font(fontNormal).text(clinicInfo.companyName, 7, 115, { width: 250 });
        pdfDoc.text(clinicInfo.address, 7, 130, { width: 250 });
        pdfDoc.text(clinicInfo.city + " " + clinicInfo.pincode, 7, 145, { width: 250 });
        pdfDoc.text(clinicInfo.state + " " + clinicInfo.country, 7, 160, { width: 250 });

        pdfDoc.font(fontBold).text("Patient details:", 400, 100);
        pdfDoc.font(fontNormal).text(patientInfo.patientId, 400, 115, { width: 250 });
        pdfDoc.text(patientInfo.doctorId, 400, 130, { width: 250 });
        pdfDoc.text(patientInfo.city + " " + patientInfo.pincode, 400, 145, { width: 250 });
        pdfDoc.text(patientInfo.state + " " + patientInfo.country, 400, 160, { width: 250 });

        pdfDoc.text("Order No: " + orderInfo.orderNo, 7, 195, { width: 250 });
        pdfDoc.text("Payment Type: " + orderInfo.paymentType, 7, 210, { width: 250 });
        pdfDoc.text("Date: " + orderInfo.invoiceDate + " " + orderInfo.invoiceTime, 7, 225, { width: 250 });

        pdfDoc.rect(7, 250, 560, 20).fill("#4B1325").stroke("#4B1325");
        pdfDoc.fillColor("#fff").text("ID", 20, 256, { width: 90 });
        pdfDoc.text("Patient ID", 110, 256, { width: 190 });
        pdfDoc.text("Doctor ID", 300, 256, { width: 100 });
        pdfDoc.text("Price", 400, 256, { width: 100 });
        pdfDoc.text("Total Price", 500, 256, { width: 100 });

        let productNo = 1;
        orderInfo.products.forEach(element => {
            console.log("adding", element.name);
            let y = 256 + (productNo * 20);
            pdfDoc.fillColor("#000").text(element.id, 20, y, { width: 90 });
            pdfDoc.text(element.name, 110, y, { width: 190 });
            pdfDoc.text(element.docotrName, 300, y, { width: 100 });
            pdfDoc.text(element.unitPrice, 400, y, { width: 100 });
            pdfDoc.text(element.totalPrice, 500, y, { width: 100 });
            productNo++;
        });

        pdfDoc.rect(7, 256 + (productNo * 20), 560, 0.2).fillColor("#000").stroke("#000");
        productNo++;

        // pdfDoc.font(fontBold).text("Total:", 400, 256 + (productNo * 17));
        // pdfDoc.font(fontBold).text(orderInfo.totalValue, 500, 256 + (productNo * 17));

        pdfDoc.end();
        console.log("pdf generate successfully");
    } catch (error) {
        console.log("Error occurred", error);
    }
}