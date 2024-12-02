const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'jwt-token-secret-key'; 

exports.register = async (req, res) => {
    const { name, email, password, confirmPassword, role } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingTeacher = await Teacher.findOne({ email });
        const existingStudent = await Student.findOne({ email });

        if (existingTeacher || existingStudent) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === 'teacher') {
            const teacher = new Teacher({ name, email, password: hashedPassword });
            await teacher.save();
            return res.status(201).json({ message: 'Teacher registered successfully' });
        } else if (role === 'student') {
            const student = new Student({ name, email, password: hashedPassword });
            await student.save();
            return res.status(201).json({ message: 'Student registered successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Teacher.findOne({ email });
        let role = 'teacher';

        if (!user) {
            user = await Student.findOne({ email });
            role = 'student';
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: role, isAdmin: user.isAdmin || false },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userType: role,
            user: { id: user._id, name: user.name, email: user.email, role, isAdmin: user.isAdmin || false },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCounts = async (req, res) => {
    try {
      const teacherCount = await Teacher.countDocuments({});
      const studentCount = await Student.countDocuments({});
      const classCount = await Class.countDocuments({});
  
      res.status(200).json({
        teachers: teacherCount,
        students: studentCount,
        classes: classCount,
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  };


  exports.profile = async (req, res) => {
    try {
        const { id, role } = req.user;

        let user;
        if (role === 'teacher') {
            user = await Teacher.findById(id).select('-password'); 
        } else if (role === 'student') {
            user = await Student.findById(id).select('-password'); 
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ success: true, role, user });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { id, role } = req.user;

        const updateData = { ...req.body }; 
        delete updateData.role; 

        let user;
        if (role === 'teacher') {
            user = await Teacher.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        } else if (role === 'student') {
            user = await Student.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
