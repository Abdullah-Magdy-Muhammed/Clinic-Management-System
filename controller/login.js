let jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ErrorResponse = require('./../utils/errorResponse');
require("./../model/employee");
require("./../model/user");
const bcrypt = require("bcrypt");
const userSchema = mongoose.model("users");



exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please Provide an email and password', 400));
  }

  if (email == "Al-Agezy@gmail.com" && password == "ahmed123") {
    let token = jwt.sign({
      role: "admin"
    }, process.env.SECRET_KEY);
    res.status(200).json({ data: "Authorized Admin", token });

  } else {
    userSchema.findOne({
      email: email,
    }).then((user) => {
      if (user != null) {
        let status = bcrypt.compareSync(password, user.password);

        if (status == true) {
          let userId;
          if (user.role == "patient") {
            userId = user.patientRef_id
          }
          else if (user.role == "employee") {
            userId = user.employeeRef_id;
          } 
          else if (user.role == "doctor") {
            userId = user.doctorsRef_id;
          }

          let token = jwt.sign(
            {
              id: userId,
              role: user.role
            },
            process.env.SECRET_KEY, {
            expiresIn: "30d",
          });
          res.status(200).json({ data: `Authorized ${user.role}`, token });
        } else {
          let error = new Error("Wrong Password")
          error.status = 403
          next(error);
        }
      } else {
        let error = new Error("Not Authinticated")
        error.status = 401;
        next(error);
      }
    });
  }
};
