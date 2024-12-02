import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, ToggleButtonGroup, ToggleButton, Table } from 'react-bootstrap';
import { API_BASE_URL } from '../config';

const Analytics = () => {
  const [view, setView] = useState('monthly'); // Default to monthly view
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { view, year };
      if (view === 'monthly') params.month = month;

      const { data } = await axios.get(`${API_BASE_URL}/api/analytics/income-expenses`, { params });
      setAnalyticsData(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(view);
    fetchAnalyticsData();
  }, [view, month, year]);

  return (
    <div className="container mt-4">
      <h2>Class Analytics</h2>

      {/* Toggle between monthly and yearly views */}
      <Row className="mb-3">
        <Col>
            <ToggleButtonGroup
                type="radio"
                name="viewToggle"
                value={view} 
                onChange={(val) => setView(val)} 
                >
                <ToggleButton variant="outline-primary" value="monthly">
                    Monthly
                </ToggleButton>
                <ToggleButton variant="outline-primary" value="yearly">
                    Yearly
                </ToggleButton>
            </ToggleButtonGroup>
        </Col>
      </Row>

      {/* Date filters */}
      <Row className="mb-3">
        {view === 'monthly' && (
          <Col>
            <Form.Select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {[...Array(12).keys()].map((m) => (
                <option key={m + 1} value={m + 1}>
                  {new Date(0, m).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Form.Select>
          </Col>
        )}
        <Col>
          <Form.Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Button onClick={fetchAnalyticsData} disabled={loading}>
            {loading ? 'Loading...' : 'Get Data'}
          </Button>
        </Col>
      </Row>

      {/* Error message */}
      {error && <p className="text-danger">{error}</p>}

      {/* Analytics Data */}
      {analyticsData && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Income (Fees)</th>
              <th>Expenses (Salaries)</th>
              <th>Number of Students Paid</th>
              <th>Number of Teachers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>₹{analyticsData.income.toLocaleString()}</td>
              <td>₹{analyticsData.expenses.toLocaleString()}</td>
              <td>{analyticsData.summary.numberOfStudentsPaid}</td>
              <td>{analyticsData.summary.numberOfTeachers}</td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Analytics;
