import React from 'react'
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout, isAdmin, isTeacher, isStudent } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/dashboard">
          📊 Attendance Portal
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAdmin() && (
              <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
            )}
            {(isAdmin() || isTeacher()) && (
              <>
                <Nav.Link as={Link} to="/mark-attendance">Mark Attendance</Nav.Link>
                <Nav.Link as={Link} to="/reports">All Reports</Nav.Link>
              </>
            )}
            {isStudent() && (
              <Nav.Link as={Link} to="/my-attendance">My Attendance</Nav.Link>
            )}
          </Nav>
          <Nav>
            <Nav.Link disabled>
              👋 {user?.name} ({user?.role})
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar