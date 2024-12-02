import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import '../pages/Dashboard.css';

const DashboardCp = () => {
  const [classDetails, setClassDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
        const result = await fetch('http://localhost:5000/api/classes/getDetails');
        const response = await result.json();
        console.log("hey hello", response.data);
        if (response.success) {
          setClassDetails(response.data);
        } else {
          setError(response.message || 'Failed to fetch class details');
        }
    };

    fetchClassDetails();
  }, []);

  const classCount = classDetails.length;
  const teacherCount = classDetails.filter(classItem => classItem.teacher).length;
  const studentCount = classDetails.reduce((acc, classItem) => acc + classItem.students.length, 0); 

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <Card className="card-large">
            <Card.Body>
              <Card.Title>Classes</Card.Title>
              <Card.Text>{classCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-large">
            <Card.Body>
              <Card.Title>Teachers</Card.Title>
              <Card.Text>{teacherCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-large">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>{studentCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mt-5">Class Details</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Year</th>
              <th>Fees Paid</th>
              <th>Teacher</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            {classDetails.map((classItem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{classItem.className}</td>
                <td>{classItem.year}</td>
                <td>{classItem.fees}</td>
                <td>{classItem.teacher?.name || 'No teacher assigned'}</td>
                <td>
                  {classItem.students.length > 0
                    ? classItem.students.map(student => student.name).join(', ')
                    : 'No students assigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DashboardCp;
