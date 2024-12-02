import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const AssignStudentsForm = ({ classId, onClose, fetchClassDetails }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
        const response = await fetch('http://localhost:5000/api/students');
        const data = await response.json();
        console.log(data)
        setStudents(data); 
      
    };

    fetchStudents();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}/assign-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds: selectedStudents }),
      });
      const result = await response.json();

      if (result.message === 'Students assigned to class successfully') {
        fetchClassDetails(classId);  // Refresh class details after assigning students
        onClose();  // Close the modal
      } else {
        setError('Failed to assign students');
      }
    } catch (err) {
      setError('Error while assigning students');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );

    console.log(selectedStudents);

  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Select Students</Form.Label>

        {students.length > 0 ? (
          students.map((student) => (
            <Form.Check
              key={student._id}
              type="checkbox"
              label={student.name} 
              value={student._id}
              onChange={() => handleStudentSelection(student._id)}
            />
          ))
        ) : (
          <div>No students available</div>
        )}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign Students'}
        </Button>
      </Form>
    </div>
  );
};

export default AssignStudentsForm;
