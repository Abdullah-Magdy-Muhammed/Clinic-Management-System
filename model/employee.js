const mongoose=require("mongoose")
const schemas = require('./schemas');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const employeeSchema =new mongoose.Schema({
    _id:{type:Number},
    name:{type:String,required:true,maxLength:20},
    hireDate:{type:Date,default:Date.now},
    birth_date:{type:Date},
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please add A valid email']
    },
    salary:{type:Number},
    phone:{
        type:String,
        match:[/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,"It is not a valid phone or line number"],
        trim: true,
        required:[true,"Phone Number is required"]
        },
    gender:{
        type:String,
        required:true,
        enum :["male","female"]
    },
    address:schemas.addressSchema,
    clinicId:{
        type:Number,
        ref:'clinic'
    },
    status:{
      type:String,
      default:'pending',
      lowercase: true,
      enum:['blocked','pending','active','deactivated']
  }
 
},{_id:false})

// Cascade delete Ref when a employee is deleted
employeeSchema.pre('remove', async function(next) {
    await this.model('users').deleteMany({ employeeRef_id:  this._id });
    next();
  });


employeeSchema.plugin(AutoIncrement, {id: 'employee_id_counter', inc_field:'_id'});

mongoose.model("employee",employeeSchema)