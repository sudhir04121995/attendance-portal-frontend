import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap'
import { Pie, Bar } from 'react-chartjs-2'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState([])
  const [stats, setStats] = useState({ totalPresent: 0, totalAbsent: 0, totalLate: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyAttendance()
    fetchMyStats()
  }, [])

  const fetchMyAttendance = async () => {
    try {
      const response = await api.get('/attendance/my-attendance')
      setAttendance(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const fetchMyStats = async () => {
    try {
      const response = await api.get('/attendance/my-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const pieData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      data: [stats.totalPresent, stats.totalAbsent, stats.totalLate],
      backgroundColor: ['#28a745', '#dc3545', '#ffc107']
    }]
  }

  const getStatusBadge = (status) => {
    const colors = {
      present: 'success',
      absent: 'danger',
      late: 'warning',
      'half-day': 'info'
    }
    return colors[status] || 'secondary'
  }

  const getAttendancePercentage = () => {
    const total = stats.totalPresent + stats.totalAbsent + stats.totalLate
    if (total === 0) return 0
    return ((stats.totalPresent / total) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h4>Loading your dashboard...</h4>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Welcome, {user?.name}!</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center bg-success text-white shadow">
            <Card.Body>
              <Card.Title>Present Days</Card.Title>
              <h1>{stats.totalPresent}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-danger text-white shadow">
            <Card.Body>
              <Card.Title>Absent Days</Card.Title>
              <h1>{stats.totalAbsent}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center bg-primary text-white shadow">
            <Card.Body>
              <Card.Title>Attendance %</Card.Title>
              <h1>{getAttendancePercentage()}%</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Your Attendance Summary</Card.Title>
              <Pie data={pieData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <Card.Title>Recent Attendance</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 10).map(record => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={getStatusBadge(record.status)}>
                          {record.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{record.checkInTime || '-'}</td>
                      <td>{record.checkOutTime || '-'}</td>
                    </tr>
                  ))}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No attendance records found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StudentDashboard