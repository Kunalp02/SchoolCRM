const Teacher = require('../models/Teacher');

exports.createTeacher = async (req, res) => {
    try {
        const newTeacher = await Teacher.create(req.body);
        res.status(201).json(newTeacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTeacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
