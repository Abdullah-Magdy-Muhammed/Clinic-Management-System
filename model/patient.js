const mongoose = require('mongoose');
const schemas = require('./schemas');
const autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");

//create schema for patient collection 
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    gender:{
        type:String,
        required:true,
        lowercase: true,
        enum:['male','female']
    },
    age:{
        type:Number
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please add A valid email']
    },
    phone:{
        type:Number,
        match:[/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,"It is not a valid phone or line number"],
        trim: true,
        required:[true,"Phone Number is required"]
        },
    address:schemas.addressSchema,
    
},{_id:false});



schema.plugin(autoIncrement, {id: 'patient_id_counter', inc_field: '_id' });


// Cascade delete appointment when a patient is deleted
schema.pre('remove', async function(next) {
    await this.model('appointment').deleteMany({ patientId: this._id });
    await this.model('users').deleteMany({ patientRef_id:  this._id });
    await this.model('prescription').deleteMany({ patientId:  this._id });
    await this.model('invoice').deleteMany({ patient:  this._id });
    next();
  });


mongoose.model('patient',schema)