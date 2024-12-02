import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import Profile from './pages/Profile';
import DashboardLayout from './componenets/DashboardLayout';
import ClassAnalytics from './pages/classAnalytics';
import ClassroomManagement from './componenets/ClassRoomManagement';
import Analytics from './pages/Analytics';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="classroom-management" element={<ClassroomManagement />} />
          <Route path="class-analytics/:classId" element={<ClassAnalytics />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
