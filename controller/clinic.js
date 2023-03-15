const { request, response } = require("express");
const { default: mongoose } = require("mongoose");
require("./../model/clinic");
const ClinicSchema = mongoose.model("clinic");



exports.getAllclinics = (request, response, next) => {

    response.status(200).json(response.advancedResults)
}


exports.addClinic = (request, response, next) => {
    let newClinic = new ClinicSchema({
        _id: request.body.id,
        name: request.body.name,
        email: request.body.email,
        location: request.body.location,
        speciality: request.body.speciality,
        medicines: request.body.medicines,
        doctors: request.body.doctors,
        employees: request.body.employees,
    })
    newClinic.save()
        .then(result => {
            response.status(201).json(result);
        })
        .catch(error => next(error))
}

exports.updateClinic = (request, response, next) => {
    ClinicSchema.updateOne({
        _id: request.params.id,
    }, {
        $set: {
            name: request.body.name,
            email: request.body.email,
            location: request.body.location,
            speciality: request.body.speciality,
            medicines: request.body.medicines,
            doctors: request.body.doctors,
            employees: request.body.employees,
        }
    })
        .then(result => {
            if (result.matchedCount == 0) {
                throw new Error("This Clinic is not found");
            } else if (result.modifiedCount == 0) {
                response.status(200).json({ "message": "No update Occured" })
            } else {
                response.status(200).json({ "message": "Clinic is updated" })
            }
        })
        .catch(error => next(error))
}
exports.getClinicByID = (request, response, next) => {
    ClinicSchema.findById(request.params.id)
        .then((data) => {
            response.status(200).json(data)
        })
        .catch(error => next(error))
}
exports.deleteClinicByID = (request, response, next) => {
    ClinicSchema.findByIdAndDelete(request.params.id)
        .then((result) => {
            if (result != null) {
                response.status(200).json({ "message": "This Clinic is deleted" })
            } else {
                throw new Error("This Clinic is not exist")
            }
        })
        .catch(error => next(error))
}
exports.getDoctors = (request, response, next) => {
    ClinicSchema.findById(request.params.id).populate({ path: "doctors", select: { _id: 0 } })
        .then((data) => {
            response.status(200).json(data.doctors)
        })
        .catch(error => next(error))
}


//
exports.pushDoctors = (request, response, next) => {
   
    const id = parseInt(request.body.doctors);
    ClinicSchema.findOne({ doctors: { $in: [id] } })
        .then((data) => {
            if (data) {
                response.status(200).json({ "message": "this doctor already exist!" })
            } else {
                
                ClinicSchema.findByIdAndUpdate(
                    { _id: request.params.id },
                    { $push: { doctors: request.body.doctors } }
                ).then(data => {
                    response.status(201).json(data.doctors)
                }).catch(error => {
                    next(new Error(error))
                })
            }
        })
}

exports.deleteDoctor = (request, response, next) => {
    ClinicSchema.findByIdAndUpdate(
        { _id: request.params.id },
        { $pull: { doctors: request.body.doctors } }
    ).then(data => {
        response.status(201).json(data.doctors)
    }).catch(error => {
        next(new Error(error))
    })
}


exports.getMedicien = (request, response, next) => {
    ClinicSchema.findById(request.params.id).populate({ path: "medicines", select: { _id: 0 } })
        .then((data) => {
            response.status(200).json(data.medicines)
        })
        .catch(error => next(error))
}

exports.pushMedicien = (request, response, next) => {
    const id = parseInt(request.body.medicines);
    ClinicSchema.findOne({ medicines: { $in: [id] } })
        .then((data) => {
            if (data) {
                response.status(200).json({ "message": "this medicine already exist!" })
            } else {
                ClinicSchema.findByIdAndUpdate(
                    { _id: request.params.id },
                    { $push: { medicines: request.body.medicines } }
                ).then(data => {
                    response.status(201).json(data.medicines)
                }).catch(error => {
                    next(new Error(error))
                })
            }
        })
}
exports.deleteMedicien = (request, response, next) => {
    ClinicSchema.findByIdAndUpdate(
        { _id: request.params.id },
        { $pull: { medicines: request.body.medicines } }
    ).then(data => {
        response.status(201).json(data.medicines)
    }).catch(error => {
        next(new Error(error))
    })
}

exports.getEmployees = (request, response, next) => {
    ClinicSchema.findById(request.params.id).populate({ path: "employees", select: { _id: 0 } })
        .then((data) => {
            response.status(200).json(data.employees)
        })
        .catch(error => next(error))
}

exports.pushEmployee = (request, response, next) => {
    const id = parseInt(request.body.employees);
    ClinicSchema.findOne({ employees: { $in: [id] } })
        .then((data) => {
            if (data) {
                response.status(200).json({ "message": "this employee already exist!" })
            } else {
                ClinicSchema.findByIdAndUpdate(
                    { _id: request.params.id },
                    { $push: { employees: request.body.employees } }
                ).then(data => {
                    response.status(201).json(data.employees)
                }).catch(error => {
                    next(new Error(error))
                })
            }
        })
}

exports.deleteEmployee = (request, response, next) => {
    ClinicSchema.findByIdAndUpdate(
        { _id: request.params.id },
        { $pull: { employees: request.body.employees } }
    ).then(data => {
        response.status(201).json({
            message:"Employee Deleted Successfully"
        })
    }).catch(error => {
        next(new Error(error))
    })
}