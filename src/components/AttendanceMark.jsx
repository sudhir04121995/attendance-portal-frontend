import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Row, Col, Alert, Card } from 'react-bootstrap'
import api from '../services/api'

const AttendanceMark = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [status, setStatus] = useState('present')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/attendance/mark', {
        userId: selectedStudent,
        date,
        status,
        checkInTime: '09:00 AM',
        checkOutTime: '05:00 PM',
        remarks: 'Marked by teacher/admin'
      })
      
      setMessage('Attendance marked successfully!')
      setTimeout(() => setMessage(''), 3000)
      setSelectedStudent('')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body className="p-4">
          <h2 className="mb-4">Mark Student Attendance</h2>
          
          {message && <Alert variant="success">{message}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Student</Form.Label>
                  <Form.Select 
                    value={selectedStudent} 
                    onChange={(e) => setSelectedStudent(e.target.value)} 
                    required
                  >
                    <option value="">Choose a student...</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="half-day">Half Day</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Mark Attendance'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AttendanceMark