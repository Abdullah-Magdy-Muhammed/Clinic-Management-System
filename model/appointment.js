const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const schema = new mongoose.Schema({
    doctorId: { type: Number, required: true, ref:"doctors"},
    date: { type: String, required: true },
    time:{type:String},
    patientId: {
        type: Number, required: true , ref:'patient'
    },
    description:{
        type:String,
        trim: true,
        maxLength:300,
    },
    clinicId: { type: Number, ref:"clinic"},
    isScaned:{ type: Boolean, default: false },
    archive:{ type: Boolean, default: false },
    calenderId:{type:Number},
    duration:{type:Number}
},{_id:false})
schema.plugin(AutoIncrement, { id: 'appointment_id_counter', inc_field: '_id' });
mongoose.model("appointment", schema);