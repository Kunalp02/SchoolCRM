import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddClassForm = ({ onClose, fetchClassDetails }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [studentFees, setStudentFees] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/classes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          year,
          studentFees,
        }),
      });
      const result = await response.json();
      if (result.success) {
        fetchClassDetails(1);  
        onClose();  
      } else {
        console.error('Error creating class:', result.message);
      }
    } catch (error) {
      console.error('Error creating class:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Class Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter class name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formYear">
        <Form.Label>Year</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formStudentFees">
        <Form.Label>Student Fees</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter fees"
          value={studentFees}
          onChange={(e) => setStudentFees(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default AddClassForm;
