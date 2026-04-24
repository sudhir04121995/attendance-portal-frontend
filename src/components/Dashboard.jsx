import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import api from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

const Dashboard = () => {
  const [stats, setStats] = useState({ totalPresent: 0, totalAbsent: 0, totalLate: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/attendance/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const pieData = {
    labels: ['Present', 'Absent', 'Late', 'Half Day'],
    datasets: [{
      data: [stats.totalPresent, stats.totalAbsent, stats.totalLate, stats.totalHalfDay || 0],
      backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#17a2b8'],
      borderWidth: 1
    }]
  }

  const barData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance Percentage',
      data: [92, 88, 95, 90],
      backgroundColor: '#007bff',
      borderRadius: 5
    }]
  }

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Attendance',
      data: [85, 88, 92, 87, 90, 93],
      borderColor: '#28a745',
      backgroundColor: 'rgba(40,167,69,0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h4>Loading dashboard...</h4>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-success text-white shadow">
            <Card.Body>
              <Card.Title>Present</Card.Title>
              <h1>{stats.totalPresent}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-danger text-white shadow">
            <Card.Body>
              <Card.Title>Absent</Card.Title>
              <h1>{stats.totalAbsent}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white shadow">
            <Card.Body>
              <Card.Title>Late</Card.Title>
              <h1>{stats.totalLate}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white shadow">
            <Card.Body>
              <Card.Title>Total Records</Card.Title>
              <h1>{stats.total}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Attendance Distribution</Card.Title>
              <Pie data={pieData} options={options} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Weekly Performance</Card.Title>
              <Bar data={barData} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Monthly Trend</Card.Title>
              <Line data={lineData} options={options} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard