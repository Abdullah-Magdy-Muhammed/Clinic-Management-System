const express = require("express");
const router = express.Router();
const controller = require("./../controller/user");
const authcontroller = require("./../controller/authController");
const validator = require("./../middlewares/errorValidation");
const validaton = require("./../middlewares/validations");
const expressValidation = require("./../middlewares/validations")
const mongoose = require('mongoose');
const allowedUsers =require("./../middlewares/AuthorizeRole");

const advancedResults = require("./../middlewares/advancedResult");
const user = mongoose.model('users');

router.post('/users/signup', authcontroller.signup);

router.route("/users")
    .get(advancedResults(user), controller.getAllUsers)



// router.get("/users/:id",
//     validator,
//     controller.getUserByID)

router.delete("/users/:id", validaton.paramIdInt,  validator, controller.deleteUser)


module.exports = router;
