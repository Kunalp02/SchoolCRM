import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const UpdateClassForm = ({ classId, onClose, fetchClassDetails }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [studentFees, setStudentFees] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes/${classId}`);
        const data = await response.json();
        console.log(response, data)
        if (response.ok) {
          setName(data.name);
          setYear(data.year);
          setStudentFees(data.studentFees);
        } else {
          setError('Failed to fetch class details');
        }
      } catch (err) {
        setError('Error fetching class details', err);
      }
    };

    fetchClassDetails();
  }, [classId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, year, studentFees }),
      });

    //   const result = await response.json();

      console.log(response);
      if (response.ok) {
        fetchClassDetails(1); // Re-fetch the class details
        onClose(); // Close the modal
      } else {
        setError('Failed to update class');
      }
    } catch (err) {
      setError('Error updating class');
    } finally {
      setLoading(false);
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

      {error && <p className="text-danger">{error}</p>}

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Form>
  );
};

export default UpdateClassForm;
