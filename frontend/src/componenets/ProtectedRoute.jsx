import { Navigate } from 'react-router-dom';
import { getToken, getUserType, isLoggedIn } from './utils/auth';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles }) => {
  // eslint-disable-next-line no-unused-vars
  const token = getToken();
  const role = getUserType();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />; // Redirect if not logged in
  }

  // eslint-disable-next-line react/prop-types
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Redirect if role is not allowed
  }

  return children;
};

export default ProtectedRoute;
