import Sidebar from "../componenets/Sidebar";
import DashboardCp from "../componenets/DashboardCp";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardCp />
      </div>
    </div>
  );
};

export default Dashboard;
