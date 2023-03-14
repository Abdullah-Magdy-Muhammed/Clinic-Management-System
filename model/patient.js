const mongoose = require('mongoose');
const schemas = require('./schemas');
const autoIncrement = require('mongoose-sequence')(mongoose);
// const bcrypt = require("bcrypt");

//create schema for patient collection 
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    sex:{
        type:String,
        required:true,
        enum:['Male','Female']
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
    address:schemas.addressSchema
   
},{_id:false});


// schema.pre('save',async function (next){
//     try{
//         const salt = await bcrypt.genSalt(12);
//         const hasdedPassword = await bcrypt.hash(this.password,salt);
//         this.password=hasdedPassword;
//         next()
//     }
//     catch(error){
//         next(error);
//     }
// })

schema.plugin(autoIncrement, {id: 'patient_id_counter', inc_field: '_id' });

mongoose.model('patient',schema)