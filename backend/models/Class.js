const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name : {
        type: String
    },
    year : {
        type: Number
    },
    teacher : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Teacher'
    },
    studentFees : {
        type: Number,
        default: 0
    },
    students : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
    ],
});

module.exports = mongoose.model('Class', classSchema);