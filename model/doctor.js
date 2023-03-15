const mongoose = require("mongoose");
const schemas = require('./schemas');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require("bcrypt");


const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of the doctor is required"],
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, "Gender of the doctor is required"]
  },
  imge: {
    type: String,
  },
  email: {
    type: String,
    match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/, "Please enter a valid email"],
    unique: [true, "This email is already exist"],
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    match: [/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g, "It is not a valid phone or line number"],
    trim: true,
    required: [true, "Phone Number of the doctor is required"]
  },
  address: schemas.addressSchema,
  speciality: {
    type: String,
    enum: {
      values: ["cardiology", "dentistry", "ear", "nose", "throat", "ENT", "nutrition", "dermatology"],
      message: "We don't have this speciality"
    },
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
  },
  clinicId: {
    type: Number,
    ref: "clinic",
  },
  price: {
    type: Number,
  },
  status:{
    type:String,
    default:'pending',
    lowercase: true,
    enum:['blocked','pending','active','deactivated']
}
}, { _id: false })


// Cascade delete Ref when a patient is deleted
doctorSchema.pre('remove', async function (next) {
  console.log(`calender being removed from Doctor ${this._id}`);
  await this.model('calender').deleteMany({ doctor: this._id });
  await this.model('users').deleteMany({ doctorsRef_id: this._id });
  next();
});


doctorSchema.plugin(AutoIncrement, { id: 'doctor_id_counter', inc_field: '_id' });
mongoose.model("doctors", doctorSchema);