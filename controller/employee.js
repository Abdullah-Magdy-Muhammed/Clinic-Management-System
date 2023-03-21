const { request, response, json } = require("express");
const mongoose = require("mongoose");
const ErrorResponse = require('./../utils/errorResponse')
const LoggerServices = require('./../services/loggerServices')


require('./../model/user');
require("../model/employee")
const employeeSchema = mongoose.model("employee")
const user = mongoose.model("users");
const logger=new LoggerServices('employee');



//Get All Employees
exports.getAllEmployees = (request, response, next) => {
    response.status(200).json(response.advancedResults)
}


///-----------------------------------------
function specificEmployee(request, response, next) {
    employeeSchema.findOne(
        { _id:request.params.id }).populate({ path:"clinicId" , select: { _id:0 , name:1 } })
        .then(data=>{
            if(data){
                logger.info(`get employee with id: ${request.params.id}`,response.advancedResults );
                response.status(200).json(data);
            }
            else{
                next(new Error("Employee doesn't exist"));
            }
        }).catch(error=>next(error))
}

//Get Employee By Id
exports.getEmployeeById=(request,response,next)=>{
    // specificEmployee(request, response, next)
    if (request.role == "employee" && request.params.id == request.id) {
        specificEmployee(request, response, next)
    } else if (request.role == "admin") {
        specificEmployee(request, response, next)
    } else {
        let error = new Error("Not Authorized");
        error.status = 403;
        next(error)
    }
}
///------------------------------------------------



//Add New Employee
exports.addEmployee = async(request, response, next) => {
    let empExist = await employeeSchema.count({ email: request.body.email });
    if (!empExist) {
    let newEmp = new employeeSchema({
        name: request.body.name,
        hireDate: request.body.hireDate,
        birth_date: request.body.birth_date,
        email: request.body.email,
        salary: request.body.salary,
        phone: request.body.phone,
        gender: request.body.gender,
        address: request.body.address,
        clinicId:request.body.clinicId,
        status: request.body.status
    });
    newEmp.save()
        .then(result => {
            let newUser = new user({
                password: request.body.password,
                email: request.body.email,
                role: "employee",
                employeeRef_id: result._id
            })
            newUser.save()
            logger.info(`add employee with id: ${request.params.id}`,response.advancedResults );
            response.status(201).json(result)
        }).catch(err => next(err))
}else {
    logger.error(`faild to add employee with id: ${request.params.id}`);
    next(new Error("This Email is already exist :) "));
}
}


//U ---------------------------------------------------

function specificEmployeeUpdate(request, response, next) {
    user.updateOne({
        employeeRef_id: request.params.id
    }, {
        $set: {
            email: request.body.email,
            password: request.body.password,
            role: "employee"
        }
    }).then(res => {
    employeeSchema.updateOne({
        _id: request.params.id
    },
        {
            $set: {
                name: request.body.name,
                hireDate: request.body.hireDate,
                birth_date: request.body.birth_date,
                email: request.body.email,
                salary: request.body.salary,
                phone: request.body.phone,
                gender: request.body.gender,
                address: request.body.address,
                clinicId:request.body.clinicId
            }
        }).then(data => {
            if (data.matchedCount == 0) {
                logger.error(`faild to update employee with id: ${request.params.id}`);
                next(new ErrorResponse("Not found any id match with (" + request.params.id + ") ", 404))
            } else {
                if (data.modifiedCount == 0) {
                    next(new ErrorResponse("No changes happen", 400))
                } else {
                    logger.info(`update employee with id: ${request.params.id}`,response.advancedResults );
                    response.status(201).json({ success: true, message: "Update patient" })
                }
            }
        })
        .catch(error => next(error))
})
}

//U ---------------------------------------------------
exports.updateEmployee = (request, response, next) => {
    specificEmployeeUpdate(request,response,next)
    // if (request.role == "employee" && request.params.id == request.id) {
    //     specificEmployeeUpdate(request,response,next)
    // } else if (request.role == "admin") {
    //     specificEmployeeUpdate(request,response,next)
    // } else {
    //     let error = new Error("Not Authorizedddd");
    //     error.status = 403;
    //     next(error)
    // }
    
}
//U ---------------------------------------------------


// @desc     Delete employee
// @route    DELETE /employee/:idw
// @access   ----
exports.deleteById = async  (request, response, next) => {
    const employeeObject = await employeeSchema.findById(request.params.id);
    if (!employeeObject) {
        return next(
          new ErrorResponse(`employee not found with id of ${request.params.id}`, 404)
        );
      }
      logger.info(`delete employee with id: ${request.params.id}`,response.advancedResults );
      employeeObject.remove();
      response.status(200).json({ success: true, messege: "Delete done successfully" })
}



exports.updateEmployeeStaus = (request, response, next)=> {
    user.updateOne({
        employeeRef_id: request.params.id
    }, {
        $set: {
            status: request.body.status
        }
    }).then(res => {
    employeeSchema.updateOne({
        _id: request.params.id
    },
        {
            $set: {
                status: request.body.status
            }
        }).then(data => {
            if (data.matchedCount == 0) {
                logger.error(`faild to update employee with id: ${request.params.id}`);
                next(new ErrorResponse("Not found any id match with (" + request.params.id + ") ", 404))
            } else {
                if (data.modifiedCount == 0) {
                    next(new ErrorResponse("No changes happen", 400))
                } else {
                    logger.info(`update employee with id: ${request.params.id}`,response.advancedResults );
                    response.status(201).json({ success: true, message: "Update patient" })
                }
            }
        })
        .catch(error => next(error))
});
};