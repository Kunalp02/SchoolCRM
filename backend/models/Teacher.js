const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender : {
        type: String,
        enum : ['Male', 'Female', 'Other']
    },
    dob: {
        type: Date
    },
    phone: { 
        type: String, 
    },
    email: { 
        type: String, required: true, unique: true 
    },
    salary : {
        type: Number
    },
    assignedClass : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
});

module.exports = mongoose.model('Teacher', teacherSchema);