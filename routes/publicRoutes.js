const express= require("express");
const mongoose = require('mongoose');
const controller = require("./../controller/patient");
const validator = require("./../middlewares/errorValidation");
const validation = require("./../middlewares/validations");
const employeeController=require("../controller/employee");
const patientController = require("./../controller/patient");
const doctorController = require("../controller/doctor");


const router = require("./employee");

router.route("/patient")
.post(validation.patientPost,validator,patientController.createPatient)

router.route("/employee")
.post(validation.employeePost,validator,employeeController.addEmployee)

router.route("/doctors")
      .post(validation.doctorPost, validator, doctorController.addNewDoctor)

module.exports=router