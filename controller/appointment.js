var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const ErrorResponse = require('./../utils/errorResponse');
const { request, response } = require("express");

require('./../model/appointment');
require('./../model/doctorCalender');
require("./../model/doctor");
require("./../model/patient");
const calender = mongoose.model('calender');
const doctors = mongoose.model('doctors');
const appointment = mongoose.model('appointment');
const patient = mongoose.model('patient');



// @desc     Create Appointment
// @route    POST /:patientID/appointment
// @access   ----
exports.createAppointment = asyncHandler(async (request, response, next) => {

    if (!(request.body.startAt && request.body.date)) {
        next(new ErrorResponse("Please Enter a specific time", 422));
    }
    const startAt = moment(request.body.startAt, "hh:mm a");
    const date = moment(request.body.date, "yyyy-MM-DD").format("yyyy-MM-DD");

    let object;
    let duration;
    let query;
    //prepare search Object 
    try {
        query = await doctors.findOne({ name: request.body.doctorName })
        let doctorObject = await query
        if (doctorObject.length == 0) {
            next(new ErrorResponse('Wrong Doctor Name'))
        }

        query = await calender.findOne({
            doctor: doctorObject._id,
            date: date,
            schedule: { $in: [startAt.format("h:mm a")] }
        })

        let calenderObject = await query;

        if (calenderObject) {
            //create new appointment
            let newAppointment = new appointment({
                doctorId: doctorObject._id,//no patch 
                date: date,
                time: startAt.format("h:mm a"),
                patientId: request.patientId,
                calenderId: calenderObject._id
            })
            newAppointment.save()
                .then(data => {

                    //update patient 
                    patient.findByIdAndUpdate(
                        { _id: request.patientId },
                        { $push: { appointment: data._id } }
                    ).then(res => {
                        console.log(res)
                    }).catch(error => {
                        next(new ErrorResponse(error));
                    })

                    //update calender
                    calender.findByIdAndUpdate(
                        { _id: calenderObject._id },
                        { $pull: { schedule: { $in: [startAt.format("h:mm a")] } } },
                        { new: true }
                    )
                        .then(res => {
                            response.status(201).json({ success: true, message: data })
                        })
                        .catch(error => {
                            next(new ErrorResponse(error));
                        })//end of catch ater save update calender

                })
                .catch(error => {
                    next(new ErrorResponse(error));
                })

        } else {
            next(new ErrorResponse(`this doctor is not available in this time`));
        }
    }
    catch (error) {
        next(new Error(error))
    }
})


//TODO Filter and sorting 
// @desc     GET all or/ Get single Appointment
// @route    GET /appointment/:id
// @access   Public
exports.getAppointment = async (request, response, next) => {

    let query;
    if (request.patientId) {
        query = appointment.find({ patientId: request.patientId }).populate({ path: "doctorId", select: { _id: 0, name: 1, address: 1, speciality: 1 } })
            .populate({ path: "patientId", select: { _id: 0, name: 1 } }).populate({ path: "clinicId", select: { _id: 0, name: 1 } })
        const appointments = await query;
        response.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        })
    } else if (request.doctorId) {
        query = appointment.find({ doctorId: request.doctorId })
            .populate({ path: "patientId", select: { _id: 0, appointment: 0, prescriptions: 0, invoices: 0, __v: 0 } }).populate({ path: "clinicId", select: { _id: 0, name: 1 } })
        const appointments = await query;
        response.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        })
    } else {
        response.status(200).json(response.advancedResults)

    }

}
////---------------------------------------------------------------------------------

exports.getAppoitmentById = (request, response, next) => {
    appointment.findOne({ _id: request.params.id })
        .then(data => {
            if (data != null) {
            //     if(data.patientId==request.id)
            //     {
                    response.status(200).json(data)
                // }else{
                //     next(new Error('Not Authorized'))
                // }
                
            }else
            {
                next(new Error('Appointment Not Found'))
            }
        }
        ).catch(error => next(error))


}

////---------------------------------------------------------------------------------





// @desc     Update Appointment
// @route    PATCH /appointment/:id
// @access   ----
exports.updateAppointment = async (request, response, next) => {

    if (Object.keys(request.body).length === 0) {
        next(new ErrorResponse("Empty data", 400))
    }
    const date = moment(request.body.date, "yyyy-MM-DD").format("yyyy-MM-DD");
    const startAt = moment(request.body.startAt, "hh:mm a");
    let query;
    let appointmentObject;
    query = await appointment.findOne({ _id: request.params.id });
    appointmentObject = await query;

    if (appointmentObject.data == date) {
        if (appointmentObject.time == request.body.startAt) {
            response.status(201).json("same data and same time")
        } else {
            query = await calender.findOne({
                doctor: appointmentObject.doctorId,
                date: appointmentObject.date,
                schedule: { $in: [startAt.format("h:mm a")] }
            })
            let calenderObject = await query;
            if (calenderObject) {

                //update appointment 
                appointment.find({
                    _id: request.params.id
                }, {
                    $set: {
                        time: startAt.format("h:mm a")
                    }
                })
                calender.findByIdAndUpdate(
                    { _id: calenderObject._id },
                    { $pull: { schedule: { $in: [startAt.format("h:mm a")] } } },
                    { new: true }
                )
                    .then(res => {
                        response.status(201).json({ success: true, message: "Updated " })
                    })
                    .catch(error => {
                        next(new ErrorResponse(error));
                    })//end of catch ater save update calender
            } else {
                next(new ErrorResponse(`this doctor is not available in this time`));
            }
        }

    } else {
        query = await calender.findOne({
            doctor: appointmentObject.doctorId,
            date: date,
            schedule: { $in: [startAt.format("h:mm a")] }
        })
        let calenderObject = await query;
        if (calenderObject) {
            //لو الوقت متاح عند الدكتور 
            //update appointment 
            appointment.find({
                _id: request.params.id
            }, {
                $set: {
                    time: startAt.format("h:mm a"),
                    date: date
                }
            })
            calender.findByIdAndUpdate(
                { _id: calenderObject._id },
                { $pull: { schedule: { $in: [startAt.format("h:mm a")] } } },
                { new: true }
            )
                .then(res => {
                    response.status(201).json({ success: true, message: "Updated " })
                })
                .catch(error => {
                    next(new ErrorResponse(error));
                })//end of catch ater save update calender
        } else {
            next(new ErrorResponse(`this doctor is not available in this time`));
        }
    }

}

// @desc     Delete Appointment
// @route    DELETE /appointment/:id
// @access   ----
exports.deleteAppointment = async (request, response, next) => {
    let query;
    const id = parseInt(request.params.id);
    appointment.findByIdAndDelete({ _id: request.params.id })
        .then(appointment => {

            patient.findByIdAndUpdate(
                { _id: appointment.patientId },
                { $pull: { appointment: { $in: [appointment._id] } } }
            ).then(patient => {}).catch(error => {
                next(new Error(error))
            })

            calender.findByIdAndUpdate(
                { _id: appointment.calenderId },
                { $push: { schedule: appointment.time } }
            ).then(res => {
                response.status(200).json({ success: true, messege: "Delete done successfully" })
            })
                .catch(error => {
                    next(new Error(error))
                })


        }).catch(error => {
            next(new Error(error))
        })

}