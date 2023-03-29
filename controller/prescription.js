const { request, response } = require("express");
const express = require("express")
const mongoose = require("mongoose");

require("../model/doctor");
require("../model/prescription");
require('../model/patient');
const patient = mongoose.model('patient');
const doctorSchema = mongoose.model("doctors");
const rescriptionschema = mongoose.model("prescription");



///---------------------------------------------------------------


exports.getAllrecriptiondata = (request, response, next) => {

  if (request.role == "doctor") {

    rescriptionschema.find({ doctorId: request.id }).populate({ path: 'doctorId', select: { name: 1, _id: 1 } })
      .populate({ path: 'patientId', select: { name: 1, age: 1, _id: 0 } })
      .then(data => {
        response.status(200).json(data)
      }).catch(error => next(error))
  }
  else if (request.role == "patient") {

    rescriptionschema.find({ patientId: request.id }).populate({ path: 'doctorId', select: { name: 1, speciality: 1, _id: 1 } })
      .populate({ path: 'patientId', select: { name: 1, _id: 1 } })
      .then(data => {
        response.status(200).json(data)
      }).catch(error => next(error))
  }
  else {
    rescriptionschema.find().populate({
      path: 'doctorId', select: { name: 1, speciality: 1, _id: 1 }
    }).populate({
      path: 'patientId', select: { name: 1, _id: 0 }
    })
      .then((data) => {
        response.status(200).json(data);
      })
      .catch(error => next(error));
  }
}

///---------------------------------------------------------------


exports.addrecriptiondata = (request, response, next) => {
  doctorSchema.findOne({ _id: request.body.doctorId })
  patient.findOne({ _id: request.body.patientId })
    .then(data => {
      if (data) {
        let newrecriptiondata = rescriptionschema({
          date: request.body.date,
          doctorId: request.body.doctorId,
          patientId: request.body.patientId,
          medicine: request.body.medicine ,
          description: request.body.description
        })
        newrecriptiondata.save()
          .then((res) => response.status(201).json(res))
          .catch((err) => next(err));
      }
      else {
        next(new Error("not found in doc schema"))
      }
    })

};

///------------------------------------------------------------------------

exports.updaterecriptionId = (request, response, next) => {
  rescriptionschema.findOne({ _id: request.params.id })
    .then(data => {
      if (data.doctorId == request.body.doctorId) {///!!
        rescriptionschema.updateOne({ _id: request.params.id },
          {
            $set: {
              date: request.body.date,
              doctorId: request.body.doctorId,
              patientId: request.body.patientId,
              medicine: request.body.medicine,
              description: request.body.description
            }
          }).then(result => {
            response.status(201).json(result)
          })
          .catch(error => next(error))
      } else {
        next(new Error('Not Authorized'))
      }
    })
}

///------------------------------------------------------------------------




///---------------------------------------------------------------

// function getPatientByPrescription(request, response, next) {
// console.log(request.id)
//   patient.find({ _id: request.id })
//     .then(patient => {
//       patient.prescriptions.toArray()

//       for(let i=0;i<patient.prescriptions.length;i++)
//       {
//         if(patient.prescriptions[i]==request.params.id)
//         {
//           rescriptionschema.findById(request.params.id)
//             .then((data) => {
//               response.status(200).json(data)
//             })
//             .catch(error => next(error))
//         }else {
//           let error = new Error("Not Authorized");
//           error.status = 403;
//           next(error)
//         }
//       }
//     }).catch(next(new Error('Not Not')))
// }

exports.getprecriptionByID = (request, response, next) => {
  rescriptionschema.findById(request.params.id)
    .then((data) => {
      response.status(200).json(data)
    })
    .catch(error => next(error))
}

///---------------------------------------------------------------




exports.deleteprecriptionByID = (request, response, next) => {
  rescriptionschema.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result != null) {
        response.status(200).json({ "message": "The recription is deleted" })
      } else {
        throw new Error("This recription is not exist")
      }
    })
    .catch(error => next(error))
}