import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import api from '../services/api'

const AttendanceReport = () => {
  const [attendances, setAttendances] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchAttendance()
    }
  }, [selectedUser, month, year])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/attendance/user/${selectedUser}?month=${month}&year=${year}`)
      setAttendances(response.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body className="p-4">
          <h2 className="mb-4">Attendance Reports</h2>
          
          <Row className="mb-4">
            <Col md={5}>
              <Form.Group>
                <Form.Label>Select User</Form.Label>
                <Form.Select 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Choose a user...</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                  {[2023, 2024, 2025].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" onClick={fetchAttendance}>
                Filter
              </Button>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No attendance records found</td>
                  </tr>
                ) : (
                  attendances.map((att, index) => (
                    <tr key={att._id}>
                      <td>{index + 1}</td>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(att.status)}`}>
                          {att.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{att.checkInTime || '-'}</td>
                      <td>{att.checkOutTime || '-'}</td>
                      <td>{att.remarks || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AttendanceReport