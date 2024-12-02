import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <Nav className="flex-column sidebar-links">
        <NavLink to="/dashboard" className="nav-link" activeClassName="active">
          <i className="fas fa-home"></i> Home
        </NavLink>
        <NavLink to="/dashboard/profile" className="nav-link" activeClassName="active">
          <i className="fas fa-user"></i> Profile
        </NavLink>
        <NavLink to="/dashboard/classroom-management" className="nav-link" activeClassName="active">
          <i className="fas fa-chalkboard-teacher"></i> Classroom
        </NavLink>
        <NavLink to="/dashboard/analytics" className="nav-link" activeClassName="active">
          <i className="fas fa-chart-bar"></i> Analytics
        </NavLink>
      </Nav>
    </div>
  );
};

export default Sidebar;
