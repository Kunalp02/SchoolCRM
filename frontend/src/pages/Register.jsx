// eslint-disable-next-line no-unused-vars
import React from 'react';
import RegisterForm from '../componenets/RegisterForm';
import '../login.css';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Create an account</h1>
        <RegisterForm />
        <h3>
          Already have an account? <Link to="/login">Login here</Link>
        </h3>
      </div>      
    </div>
  )
}

export default Register
