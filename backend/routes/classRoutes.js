const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/getDetails', classController.getClassDetails);
router.get('/:id', classController.getClassById);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.get('/:id/analytics', classController.getClassAnalytics);
router.get('/details', classController.getClassDetails);
router.post('/:classId/assign-teacher', classController.assignTeacherToClass);
router.post('/:classId/assign-students', classController.assignStudentsToClass);

module.exports = router;
