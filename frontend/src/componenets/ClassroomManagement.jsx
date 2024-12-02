import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Table,
  Button,
  Modal,
  Pagination,
  Alert,
  Spinner,
  Card,
  ButtonGroup,
} from 'react-bootstrap';
import { FaChalkboardTeacher, FaUsers, FaTrash, FaUserPlus, FaEye, FaEdit } from 'react-icons/fa';
import AddClassForm from './AddClassForm';
import AssignStudentsForm from './AddStudentsForm';
import AssignTeacherForm from './AssignTeacherForm';
import '../pages/Dashboard.css';
import UpdateClassForm from './UpdateClassForm';

const ClassroomManagement = () => {
  const [classDetails, setClassDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [showUpdateClassModal, setShowUpdateClassModal] = useState(false);  
  const [selectedClassId, setSelectedClassId] = useState(null);

  const navigate = useNavigate();

  const fetchClassDetails = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/classes/getDetails?page=${page}&limit=10`);
      const result = await response.json();
      if (result.success) {
        setClassDetails(result.data);
        setTotalPages(result.totalPages);
      } else {
        setError(result.message || 'Failed to fetch class details');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    console.log(classDetails);
    fetchClassDetails(page);
  }, [page]);

  const handleOpenAddClassModal = () => setShowAddClassModal(true);
  const handleCloseAddClassModal = () => setShowAddClassModal(false);

  const handleOpenAssignTeacherModal = (classId) => {
    setSelectedClassId(classId);
    setShowAssignTeacherModal(true);
  };
  const handleCloseAssignTeacherModal = () => setShowAssignTeacherModal(false);

  const handleOpenAssignStudentsModal = (classId) => {
    setSelectedClassId(classId);
    setShowAssignStudentsModal(true);
  };
  const handleCloseAssignStudentsModal = () => setShowAssignStudentsModal(false);

  const handleOpenUpdateClassModal = (classId) => {
    setSelectedClassId(classId);
    setShowUpdateClassModal(true);
  };
  const handleCloseUpdateClassModal = () => setShowUpdateClassModal(false);


  const handleDeleteClass = async (classId) => {
    if (!classId) {
      setError('Invalid class ID');
      return;
    }
  
    const response = await fetch(`http://localhost:5000/api/classes/${classId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchClassDetails(page);
    } else {
      setError(response.message || 'Failed to delete class');
    }
    
  };

  const handleViewClassAnalytics = (classId) => {
    navigate(`/dashboard/class-analytics/${classId}`);
  };

  return (
    <Container fluid className="classroom-management">
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title as="h1" className="text-center">
            Classroom Management
          </Card.Title>
        </Card.Body>
      </Card>

      <Button
        onClick={handleOpenAddClassModal}
        className="mb-3"
        variant="success"
        size="lg"
      >
        Add New Class
      </Button>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Class Name</th>
              <th>Year</th>
              <th>Fees</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classDetails.map((classItem, index) => (
              <tr key={classItem._id || index}>
                <td>{index + 1}</td>
                <td>{classItem.className}</td>
                <td>{classItem.year}</td>
                <td>{classItem.fees}</td>
                <td>{classItem.teacher?.name || 'No teacher assigned'}</td>
                <td>
                  <ButtonGroup className="me-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewClassAnalytics(classItem._id)}
                    >
                      <FaEye /> View Analytics
                    </Button>

                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleOpenUpdateClassModal(classItem._id)} // Open Update Modal
                    >
                      <FaEdit /> Update
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleOpenAssignTeacherModal(classItem._id)}
                    >
                      <FaChalkboardTeacher /> Assign Teacher
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleOpenAssignStudentsModal(classItem._id)}
                    >
                      <FaUserPlus /> Assign Students
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClass(classItem._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Pagination>
        {[...Array(totalPages).keys()].map((pageIndex) => (
          <Pagination.Item
            key={pageIndex + 1}
            active={pageIndex + 1 === page}
            onClick={() => setPage(pageIndex + 1)}
          >
            {pageIndex + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Modals */}
      <Modal show={showAddClassModal} onHide={handleCloseAddClassModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddClassForm onClose={handleCloseAddClassModal} fetchClassDetails={fetchClassDetails} />
        </Modal.Body>
      </Modal>

      <Modal show={showAssignTeacherModal} onHide={handleCloseAssignTeacherModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AssignTeacherForm
            classId={selectedClassId}
            onClose={handleCloseAssignTeacherModal}
            fetchClassDetails={fetchClassDetails}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showAssignStudentsModal} onHide={handleCloseAssignStudentsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AssignStudentsForm
            classId={selectedClassId}
            onClose={handleCloseAssignStudentsModal}
            fetchClassDetails={fetchClassDetails}
          />
        </Modal.Body>
      </Modal>

      {/* Update Class Modal */}
      <Modal show={showUpdateClassModal} onHide={handleCloseUpdateClassModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateClassForm
            classId={selectedClassId}
            onClose={handleCloseUpdateClassModal}
            fetchClassDetails={fetchClassDetails}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ClassroomManagement;
