const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');


exports.createClass = async (req, res) => {
    try {
      const { name, year, studentFees } = req.body;
  
      const existingClass = await Class.findOne({ name, year });
  
      if (existingClass) {
        return res.status(400).json({
          success: false,
          message: 'Class with this name and year already exists.',
        });
      }
  
      const newClass = await Class.create({
        name,
        year,
        studentFees,  
      });
  
      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: newClass,  
      });
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  };
  


exports.getAllClasses = async(req, res) => {
    const classes = await Class.find().populate('teacher students');
    res.status(200).json(classes);
};


exports.getClassById = async(req, res) => {
    const classData = await Class.findById(req.params.id).populate('teacher students');
    if(!classData){
        return res.status(404).json({
            message: 'Class not found'
        });
    }
    return res.status(200).json(classData);
}

exports.updateClass = async(req, res) => {
    const {name, year, teacherId, studentFees} = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
        req.params.id,
        {name, year, teacher:teacherId, studentFees},
        {new: true}
    );
    res.status(200).json(updatedClass);
}

exports.deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getClassAnalytics = async (req, res) => {
  const { id } = req.params; 
  try {
    // Fetch the class data with teacher and students populated
    const classData = await Class.findById(id)
      .populate('teacher', 'name') // Fetch only 'name' field for the teacher
      .populate('students', 'name gender'); // Fetch 'name' and 'gender' fields for students

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Initialize gender statistics
    const genderStats = classData.students.reduce(
      (acc, student) => {
        const gender = student.gender.toLowerCase(); // Convert gender to lowercase for case-insensitive comparison
        if (gender === 'male') acc.male += 1;
        else if (gender === 'female') acc.female += 1;
        else acc.other += 1; // For any other gender values
        return acc;
      },
      { male: 0, female: 0, other: 0 } // Default counts for male, female, and other
    );

    // Prepare the analytics data to send in response
    const analyticsData = {
      className: classData.className, // Assuming className exists
      year: classData.year, // Assuming year exists
      teacher: classData.teacher?.name || 'No teacher assigned', // Handle missing teacher
      students: classData.students.map((student) => ({
        id: student._id,
        name: student.name,
        gender: student.gender,
      })),
      genderStats, // Gender statistics with male, female, and other counts
    };

    // Send success response with the analytics data
    res.status(200).json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error('Error fetching class analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message,
    });
  }
};



exports.getClassDetails = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const skip = (page - 1) * limit;
  
      const totalClasses = await Class.countDocuments();
  
      const classes = await Class.find()
      .skip(skip)
      .limit(limit)
      .populate('students', 'name gender dob contact feesPaid')
      .populate('teacher', 'name email contact')
      .select('name year studentFees');

      
      const classDetails = classes.map(classItem => ({
        _id:classItem.id,
        className: classItem.name,
        year: classItem.year,
        fees: classItem.studentFees,
        teacher: classItem.teacher || 'No teacher assigned',
        students: classItem.students || [],
      }));
      

      res.status(200).json({
        success: true,
        data: classDetails,
        total: totalClasses,
        page,
        totalPages: Math.ceil(totalClasses / limit),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  


exports.assignTeacherToClass = async (req, res) => {
    const { classId } = req.params;  
    const { teacherId } = req.body;  
  
    try {
      const classObj = await Class.findById(classId);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      classObj.teacher = teacherId;
      await classObj.save();
  
      return res.status(200).json({
        message: 'Teacher assigned to class successfully',
        class: classObj,
      });
    } catch (error) {
      console.error('Error assigning teacher:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

  exports.assignStudentsToClass = async (req, res) => {
    const { classId } = req.params;  
    const { studentIds } = req.body;
  
    try {
      if (!studentIds || studentIds.length === 0) {
        return res.status(400).json({ message: 'No students selected' });
      }
  
      const classExists = await Class.exists({ _id: classId });
      if (!classExists) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      const validStudents = await Student.find({ _id: { $in: studentIds } }).select('_id');
      const validStudentIds = validStudents.map(student => student._id.toString());
  
      const invalidStudents = studentIds.filter(id => !validStudentIds.includes(id));
      if (invalidStudents.length > 0) {
        return res.status(404).json({ message: `Students not found: ${invalidStudents.join(', ')}` });
      }
  
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { $addToSet: { students: { $each: validStudentIds } } },
        { new: true }
      ).populate('students', 'name email');
  
      res.status(200).json({
        message: 'Students assigned to class successfully',
        class: updatedClass,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
