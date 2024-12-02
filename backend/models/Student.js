const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  dob: {
    type: Date,
  },
  phone: { 
    type: String
  },
  email: { 
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"], // Optional regex validation
  },
  password :{
    type: String,
  },
  feesPaid: {
    type: Boolean,
    default: false,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
});

module.exports = mongoose.model('Student', studentSchema);
