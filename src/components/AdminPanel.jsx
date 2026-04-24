import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const AdminPanel = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
    fetchStudents()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students')
      setStudents(response.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, formData)
        setMessage('User updated successfully!')
      } else {
        await api.post('/users', formData)
        setMessage('User created successfully!')
      }
      setShowModal(false)
      resetForm()
      fetchUsers()
      fetchStudents()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`)
        setMessage('User deleted successfully!')
        fetchUsers()
        fetchStudents()
        setTimeout(() => setMessage(''), 3000)
      } catch (error) {
        setMessage('Delete failed')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      department: ''
    })
    setEditingUser(null)
  }

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        department: user.department || ''
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <h4>Loading...</h4>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {message && <Alert variant="success">{message}</Alert>}
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center bg-primary text-white shadow">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h1>{users.length}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-success text-white shadow">
            <Card.Body>
              <Card.Title>Students</Card.Title>
              <h1>{students.length}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-warning text-white shadow">
            <Card.Body>
              <Card.Title>Teachers</Card.Title>
              <h1>{users.filter(u => u.role === 'teacher').length}</h1>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center bg-info text-white shadow">
            <Card.Body>
              <Card.Title>Admins</Card.Title>
              <h1>{users.filter(u => u.role === 'admin').length}</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Manage Users</Card.Title>
            <Button variant="primary" onClick={() => openModal()}>
              + Add New User
            </Button>
          </div>
          
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={
                      user.role === 'admin' ? 'danger' :
                      user.role === 'teacher' ? 'warning' : 'success'
                    }>
                      {user.role}
                    </Badge>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => openModal(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </Form.Group>
            
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Computer Science"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default AdminPanel