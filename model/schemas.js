const mongoose = require('mongoose')

exports.addressSchema = new mongoose.Schema({
    city:{type:String,required:true,maxLength:20},
    street:{type:String,maxLength:50},
    building:{type:Number}
  }, { _id: false })