import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageTeachers from "../pages/Admin/ManageTeachers";
import ManageStudents from "../pages/Admin/ManageStudents";
import ClassroomManagement from "../componenets/ClassRoomManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-teachers" element={<ManageTeachers />} />
      <Route path="/admin/manage-students" element={<ManageStudents />} />
      <Route path="/classroom-management" element={<ClassroomManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
