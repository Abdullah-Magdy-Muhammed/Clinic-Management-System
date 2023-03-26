const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const schemas = require('./schemas');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = new mongoose.Schema({
    // _id: Number,
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add A valid email']
    },
    password: { type: String, required: true },
    role: {
        type: String, enum: {
            values: ['doctor', 'employee', 'patient'],
            message: 'this not supported'
        }
    },
    status: {
        type: String,
        default: 'pending',
        lowercase: true,
        enum: ['blocked', 'pending', 'active', 'deactivated']
    },
    patientRef_id: {
        type: Number,
        ref: 'patient',
        default: 0
    },
    employeeRef_id: {
        type: Number,
        ref: 'employee',
        default: 0
    },
    doctorsRef_id: {
        type: Number,
        ref: 'doctors',
        default: 0
    }
}, { _id: false })


Schema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(12);
        const hasdedPassword = await bcrypt.hash(this.password, salt);
        this.password = hasdedPassword;
        next()
    }
    catch (error) {
        next(error);
    }
})


// Cascade delete appointment when a patient is deleted
Schema.pre('remove', async function (next) {
    if (this.patientRef_id != 0) {
        await this.model('patient').deleteMany({ _id: this.patientRef_id });
    } else if (this.employeeRef_id != 0) {
        await this.model('employee').deleteMany({ _id: this.employeeRef_id });
    } else if (this.doctorsRef_id != 0) {
        await this.model('doctors').deleteMany({ _id: this.doctorsRef_id });
    }
    next();
});

Schema.plugin(AutoIncrement, { id: '_id_counter', inc_field: '_id' });

mongoose.model("users", Schema)