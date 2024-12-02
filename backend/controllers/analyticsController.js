const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

exports.getFeesAndSalaries = async (req, res) => {
  try {
    const { view, month, year } = req.query;

    if (!view || !year || (view === 'monthly' && !month)) {
      return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    const studentFilter = {};
    const teacherFilter = {};

    if (view === 'monthly') {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);

      studentFilter.updatedAt = { $gte: startOfMonth, $lt: endOfMonth };
      teacherFilter.updatedAt = { $gte: startOfMonth, $lt: endOfMonth };
    } else if (view === 'yearly') {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31);

      studentFilter.updatedAt = { $gte: startOfYear, $lt: endOfYear };
      teacherFilter.updatedAt = { $gte: startOfYear, $lt: endOfYear };
    }

    const paidStudents = await Student.find({ ...studentFilter, feesPaid: true });
    const income = paidStudents.reduce((total, student) => total + (student.studentFees || 0), 0);

    const teachers = await Teacher.find(teacherFilter);
    const expenses = teachers.reduce((total, teacher) => total + (teacher.salary || 0), 0);

    res.json({
      income,
      expenses,
      summary: {
        numberOfStudentsPaid: paidStudents.length,
        numberOfTeachers: teachers.length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
