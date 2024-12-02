import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Container, Table, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './ClassAnalytics.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ClassAnalytics = () => {
  const { classId } = useParams(); // Get classId from URL params
  const [classDetails, setClassDetails] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/classes/${classId}/analytics`
        );

        const result = await response.json();

        if (result.success) {
          const { genderStats, year, teacher, students } = result.data;

          // Prepare chart data
          const data = {
            labels: ["Male", "Female", "Other"],
            datasets: [
              {
                label: "# of Students",
                data: [
                  genderStats.male || 0,
                  genderStats.female || 0,
                  genderStats.other || 0,
                ],
                backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
              },
            ],
          };

          // Set class details and chart data
          setClassDetails({
            year,
            teacher,
            students,
          });
          setChartData(data);
        } else {
          setError("Failed to fetch analytics data.");
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [classId]); // Trigger fetch when classId changes

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1>Class Analytics</h1>
      <p><strong>Class Name:</strong> {classDetails?.className}</p>
      <p><strong>Year:</strong> {classDetails?.year}</p>
      <p><strong>Teacher:</strong> {classDetails?.teacher || "Not assigned"}</p>
      
      <h3>Students:</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {classDetails?.students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.gender}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <h3>Gender Distribution</h3>
      {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
        <div className="doughnut-chart">
          <Doughnut data={chartData} />
        </div>
      ) : (
        <Alert variant="warning">No data available for gender distribution.</Alert>
      )}
    </Container>
  );
};

export default ClassAnalytics;
