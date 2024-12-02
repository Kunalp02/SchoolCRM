const Student = require('../models/Student');
const Class = require('../models/Class');

exports.createStudent = async (req, res) => {
    const {classId, name, gender, dob, contact, feesPaid} = req.body;

    const classData = await Class.findById(classId);
    if(!classData){
        return res.status(404).json({
            message : 'Class not found'
        });
    }

    if(classData.students.length >= 30){
        return res.status(400).json({ message: 'Class is full' });
    }

    const newStudent = new Student({
        name,
        gender,
        dob,
        contact,
        feesPaid,
        class: classId  
    });

    await newStudent.save();
    classData.students.push(newStudent._id);  
    await classData.save();
    res.status(201).json(newStudent);

};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
