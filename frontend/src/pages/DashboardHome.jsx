import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import './Dashboard.css';
import { API_BASE_URL } from '../config';

const DashboardHome = () => {
  const [stats, setStats] = useState({ teachers: 0, students: 0, classes: 0 });
  const [classDetails, setClassDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch overall counts
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/getCounts`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch stats', err);
      }
    };

    // Fetch detailed class information
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/classes/getDetails`);
        const data = await response.json();
        if (data.success) {
          setClassDetails(data.data);
        } else {
          setError(data.message || 'Failed to fetch class details');
        }
      } catch (err) {
        setError('An error occurred while fetching class details', err);
      }
    };

    fetchStats();
    fetchClassDetails();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Classes</Card.Title>
              <Card.Text>{stats.classes}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Teachers</Card.Title>
              <Card.Text>{stats.teachers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <Card.Text>{stats.students}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="mt-4">Class Details</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover>
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
            {classDetails.map((cls, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cls.className}</td>
                <td>{cls.year}</td>
                <td>{cls.fees}</td>
                <td>{cls.teacher?.name || 'No teacher assigned'}</td>
                <td>
                  {cls.students.length
                    ? cls.students.length
                    : 'No students'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default DashboardHome;
