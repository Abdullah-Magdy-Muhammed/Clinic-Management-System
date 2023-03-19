const mongoose=require('mongoose');
const  autoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");


const schema = new mongoose.Schema({
    drugName:{
        type:String,
        required:[true,'Please add a DrugName'],
        trim:true,
    },
    dosage:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true},
    form:{ 
        type:String,
        required:[true,'Please add a form in "cap", "susp" , "jugs", "cream", "Eye_Drops" ,"tab"'],
        enum: ["cap", "susp" , "jugs", "cream", "Eye_Drops" ,"tab"]
    },
    price:{
        type:Number,
        required:[true,'Please add a price']
     },
    quantity:{
        type:Number,
        required:[true,'Please add a quantity']
     },
     archive:{ type: Boolean, default: false },
    mfd_date: {
         type: Date, 
        //  required:[true,'Please add a  mfd_date']
         default:new Date().toLocaleDateString("en-US")
         },
    exp_date: { 
        type: Date ,
        required:[true,'Please add a  Exp_date']
},
},{_id:false});


schema.plugin(autoIncrement, {id: 'id_counter', inc_field: '_id' });


module.exports=mongoose.model("medicine",schema);
