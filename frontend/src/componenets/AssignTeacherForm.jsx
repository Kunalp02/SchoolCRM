import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const AssignTeacherForm = ({ classId, onClose, fetchClassDetails }) => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch list of teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teachers');
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        setError('Failed to load teachers');
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) {
      setError('Please select a teacher');
      return;
    }

    setIsSubmitting(true);
    setError(null); // Reset error before making the request

    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}/assign-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherId: selectedTeacher }),
      });

      const result = await response.json();
      console.log(result, result.message);
      // Check if the result has success key and it's true
      if (result.message == 'Teacher assigned to class successfully') {
        fetchClassDetails(); // Fetch updated class details
        onClose();  // Close the modal/form
      } else {
        setError(result.message || 'Failed to assign teacher'); // Display server message if available
      }
    } catch (err) {
      console.error('Error while assigning teacher:', err);
      setError('An error occurred while assigning teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formTeacher">
          <Form.Label>Select Teacher</Form.Label>
          <Form.Control
            as="select"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
          >
            <option value="">-- Select Teacher --</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
        </Button>
      </Form>
    </div>
  );
};

export default AssignTeacherForm;
