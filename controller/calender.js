const moment = require("moment");
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('./../utils/errorResponse');
const { response, request } = require("express");
const momentDurationFormatSetup = require("moment-duration-format");
require('./../model/doctorCalender');
require("./../model/doctor");
const calender= mongoose.model('calender');
const doctors= mongoose.model('doctors');





// @desc     Get all Calender
// @route    GET /calender
// @access   Public
exports.getCalenders = async (request,response,next)=>{

    let query;
     if (request.doctorId) {
        query = calender.find({ doctor: request.doctorId })
        const calenders = await query;
        response.status(200).json({
            success: true,
            count: calenders.length,
            data: calenders
        })
    } else {
        response.status(200).json(response.advancedResults)

    }
}


// @desc     Create calender
// @route    POST /calender
// @access   ----
exports.createCalender = async (request,response,next) => {
   
    if (!(request.body.startAt && request.body.endAt && request.body.date)) {
        next(new ErrorResponse("Please Enter a specific time", 422));
    }
    const doctorId = parseInt(request.doctorId);
    const startAt = moment(request.body.startAt, "h:mm a");
    const endAt = moment(request.body.endAt, "h:mm a");
    const date = moment(request.body.date, "yyyy-MM-DD").format("yyyy-MM-DD");
    const totalWorking = moment.duration(endAt.diff(startAt));
    const totalWorkingMinutes = moment.duration(endAt.diff(startAt)).asMinutes();
    let totalWorkingHours = totalWorking.hours() + 'h,' + totalWorking.minutes() + 'm'
   if(totalWorkingMinutes<=0){
    next(new ErrorResponse ("Error in Time YOU SHOULD USE 24h Format"))
   }
    let numDurations = totalWorkingMinutes /30 ;
    let schedule = [];
    let currentTime = startAt;
    
    for (let i = 1; i < numDurations; i++) {
        if(i==1){
            schedule.push(currentTime.format("h:mm a"))
        }else{
            let newAppointment = await moment(currentTime).add(30,"m");
            schedule.push(newAppointment.format("h:mm a"))
            currentTime = newAppointment;
        }
    }

    calender.findOne({
        doctor: doctorId,
        date: date,
    }).then(data=>{
        
        if(data)
            next(new Error(" already exist")); 
        else{

        let newCalenderId;
        let newCalender = new calender({
            date: date,
            startAt: startAt.format("h:mm a"),
            endAt: endAt.format("h:mm a"),
            totalWorkingHours: totalWorkingHours,
            schedule:schedule,
            doctor: doctorId,
             })
            newCalender.save().then(data=>{ response.status(200).json({ message: "calender Added successfully" })})
                .catch(error=>{
                    next(new Error (error));
                })//end of catch ater save calender
        }

    })

   

}

// @desc     Get single Calender
// @route    GET /calender/:id
// @access   Public

exports.getCalender =(request,response,next)=>{
    if(request.role=="doctor"){
        calender.findOne({_id:request.params.id})
        .then(data=>{
            if(data!=null){
                if(data.doctor==request.id){
                    console.log(request.id)
                response.status(200).json(data);   
                }
                else next(new Error('Not Authorized'))
            }else{
                next(new ErrorResponse(`calender doesn't exist with id of ${request.params.id}`,404))
            }
        })
        .catch(error=>next(error))
    }else{
        calender.findOne({_id:request.params.id})
        .then(data=>{
            if(data!=null){
                response.status(200).json(data);
            }else{
                next(new ErrorResponse(`calender doesn't exist with id of ${request.params.id}`,404))
            }
        })
    }
}

// @desc     delete calender
// @route    DELETE /calender
// @access   ----
exports.deleteCalender =asyncHandler( async (request,response,next)=>{
    const id = parseInt(request.params.id);
    try{
       calender.deleteOne({_id:request.params.id}).then(res=>{
            response.status(200).json({success:true,messege:"Delete done successfully"})
       }).catch(err=>{
            response.status(400).send("Bad request - User not found");
       })

    }
    catch (error){
        throw next(new Error(error))
    }
    
})
