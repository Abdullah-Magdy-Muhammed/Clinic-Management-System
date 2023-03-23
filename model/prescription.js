const mongoose=require("mongoose") ;
const autoIncrement = require('mongoose-sequence')(mongoose);
const schema=new mongoose.Schema({
    _id:{type:Number},
    date:{type:Date},
    doctorId: {type:Number, required: true, ref: "doctors"},
    patientId: {type: Number, required: true, ref: "patient"},
    medicine: {type: Array,required:true ,ref: 'medicine' },
    description:{type:String,required:true}
},{_id:false})
schema.plugin(autoIncrement, { id: 'prescription_id_counter', inc_field: '_id' });
mongoose.model("prescription",schema) ;///set 


