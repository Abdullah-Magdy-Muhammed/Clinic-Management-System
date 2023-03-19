const express = require("express")
const mongoose = require("mongoose");
const ErrorResponse = require('./../utils/errorResponse')
const LoggerServices = require('./../services/loggerServices')

require("./../model/doctor");
require('./../model/user');
const doctorSchema = mongoose.model("doctors");
const user = mongoose.model('users');
const logger = new LoggerServices('doctor');


// @desc     reRoute
exports.reRoute = (request, response, next) => {
    doctorSchema.findOne({ _id: request.params.doctorId })
        .then(data => {
            if (data != null) {
                request.doctorId = request.params.doctorId
                next()
            } else {
                next(new ErrorResponse(`doctor doesn't exist with id of ${request.params.doctorId}`, 404))
            }
        }).catch(error => {
            next(new Error(error))
        })
}

exports.getAllDoctors = (request, response, next) => {
    logger.info(`get doctor list`, response.advancedResults);
    response.status(200).json(response.advancedResults)
}

exports.addNewDoctor = async (request, response, next) => {
    let doctorExist = await doctorSchema.count({ email: request.body.email });
    if (!doctorExist) {

        let newDoctor = new doctorSchema({
            name: request.body.name,
            gender: request.body.gender,
            email: request.body.email,
            //image:request.file.filename,
            phone: request.body.phone,
            address: request.body.address,
            speciality: request.body.speciality,
            yearsOfExperience: request.body.yearsOfExperience,
            calender: request.body.calender,
            clinicId: request.body.clinicId,
            appointmentId: request.body.appointmentId,
            price: request.body.price,
            status: request.body.status
        });
        newDoctor.save()
            .then((result) => {
                let newUser = new user({
                    password: request.body.password,
                    email: request.body.email,
                    role: "doctor",
                    doctorsRef_id: result._id
                })
                newUser.save()
                logger.info(`add doctor with id: ${request.params.id}`, response.advancedResults);
                response.status(200).json({ message: "Doctor added successfully", result })
            })
            .catch(error => { next(error) })
    } else {
        logger.error(`faild to add doctor with id: ${request.params.id}`);
        next(new Error("This email is already exist!"));
    }

}



function specificDoctorUpdate(request, response, next) {
    user.updateOne({
        doctorsRef_id: request.params.id
    }, {
        $set: {
            email: request.body.email,
            password: request.body.password,
            status: request.body.status,
            role: "doctor"
        }
    }).then(res => {

        doctorSchema.updateOne(
            { _id: request.params.id },
            {
                $set: {
                    name: request.body.name,
                    gender: request.body.gender,
                    email: request.body.email,
                    //image:request.file.filename,
                    phone: request.body.phone,
                    address: request.body.address,
                    speciality: request.body.speciality,
                    yearsOfExperience: request.body.yearsOfExperience,
                    calender: request.body.calender,
                    clinicId: request.body.clinicId,
                    appointmentId: request.body.appointmentId,
                    price: request.body.price,
                    status: request.body.status
                }
            },
            {}
        )
            .then(result => {
                if (result.matchedCount == 0) {
                    logger.error(`faild to update doctor with id: ${request.params.id}`);
                    throw new Error("This doctor is not exist");
                }
                else {
                    logger.info(`update Doctor with id: ${request.params.id}`, response.advancedResults);
                    response.status(200).json({ message: "Doctor updated successfully" })
                }
            })
            .catch(error => { next(error) })
    })
}


exports.updateDoctor = (request, response, next) => {
    specificDoctorUpdate(request, response, next)
    // if (request.role == "doctor" && request.params.id == request.id) {
    //     specificDoctorUpdate(request, response, next)
    // } else if (request.role == "admin" || request.role == "employee") {
    //     specificDoctorUpdate(request, response, next)
    // } else {
    //     let error = new Error("Not Authorized");
    //     error.status = 403;
    //     next(error)
    // }
}



function specificDoctor(request, response, next) {
    doctorSchema.findOne({ _id: request.params.id })
        .then((data) => {
            if (data != null) {
                logger.info(`get doctor with id: ${request.params.id}`);
                response.status(200).json(data)
            }
            else {
                logger.error(`faild to get doctor with id: ${request.params.id}`);
                throw new Error("Doctor not found")
            }
        })
        .catch(error => next(error))
}

exports.getDoctorById = (request, response, next) => {
            specificDoctor(request, response, next)

    // if (request.role == "doctor" && request.params.id == request.id) {
    //     specificDoctor(request, response, next)
    // } else if (request.role == "admin" || request.role == "employee") {
    //     specificDoctor(request, response, next)
    // } else {
    //     let error = new Error("Not Authorized");
    //     error.status = 403;
    //     next(error)
    // }
}

// @desc     Delete doctor
// @route    DELETE /doctor/:id
// @access   ----
exports.deleteDoctor = async (request, response, next) => {
    const doctorObject = await doctorSchema.findById(request.params.id);
    if (!doctorObject) {
        logger.error(`faild to delete doctor with id: ${request.params.id}`);
        return next(
            new ErrorResponse(`doctor not found with id of ${request.params.id}`, 404)
        );
    }
    doctorObject.remove();
    logger.info(`delete doctor with id: ${request.params.id}`, response.advancedResults);
    response.status(200).json({ success: true, messege: "Delete done successfully" })
}



exports.updateDoctorStatus = async  (request, response, next) => {
    user.updateOne({
        doctorsRef_id: request.params.id
    }, {
        $set: {
            status: request.body.status
        }
    }).then(res => {

        doctorSchema.updateOne(
            { _id: request.params.id },
            {
                $set: {
                    status: request.body.status
                }
            },
            {}
        )
            .then(result => {
                if (result.matchedCount == 0) {
                    logger.error(`faild to update doctor with id: ${request.params.id}`);
                    throw new Error("This doctor is not exist");
                }
                else {
                    logger.info(`update Doctor with id: ${request.params.id}`, response.advancedResults);
                    response.status(200).json({ message: "Doctor updated successfully" })
                }
            })
            .catch(error => { next(error) })
    })
}