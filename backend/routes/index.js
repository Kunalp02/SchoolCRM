const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const classRoutes = require('./classRoutes');
const teacherRoutes = require('./teacherRoutes');
const studentRoutes = require('./studentRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/classes', classRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;