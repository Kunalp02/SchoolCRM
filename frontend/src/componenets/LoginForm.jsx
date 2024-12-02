import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios'; // Make sure to install axios
import { API_BASE_URL } from '../config';
// eslint-disable-next-line react/prop-types
const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      console.log(response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        onLoginSuccess(response.data.token, response.data.user);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      {error && <p className="text-danger">{error}</p>}

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
