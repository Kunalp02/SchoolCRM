
import '../login.css';
import LoginForm from '../componenets/LoginForm';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();

  const handleLoginSuccess = (token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    navigate('/dashboard');
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <p>Please log in to your account</p>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <h3>
          Don&apos;t have an account? <Link to="/signup">Register here</Link>
        </h3>
      </div>
      
    </div>
  );
};

export default Login;
