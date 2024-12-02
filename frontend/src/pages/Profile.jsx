import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [profileData, setProfileData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    feesPaid: false,
    role: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedDob = response.data.user.dob ? new Date(response.data.user.dob).toISOString().split('T')[0] : '';

        setProfileData({
          ...response.data.user,
          dob: formattedDob,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profile data.");
        setLoading(false);
      }
    };

    getProfileData();
  }, [token]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProfileData({
      ...profileData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    console.log(profileData);
  
      const response = await axios.post(
        'http://localhost:5000/api/auth/updateProfile',
        {
          name: profileData.name,
          gender: profileData.gender,
          dob: profileData.dob,
          phone: profileData.phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Profile updated successfully:', response.data);
      console.log(response);
      console.log(
        profileData.name,
        profileData.gender,
        profileData.dob,
        profileData.phone
      )
  };
  

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h1>
            {role
              ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Profile`
              : "User Profile"}
          </h1>
          <p>Update your profile details below.</p>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            {role === "student" && (
              <Form.Group controlId="formFeesPaid">
                <Form.Check
                  type="checkbox"
                  label="Fees Paid"
                  name="feesPaid"
                  checked={profileData.feesPaid}
                  onChange={handleInputChange}
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
