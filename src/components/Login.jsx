import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      login(response.data.user, response.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Left Side - Brand Section */}
          <Col lg={6} className="d-none d-lg-flex bg-primary bg-gradient" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div className="d-flex flex-column justify-content-center p-5 text-white">
              <div className="text-center mb-5">
                <div className="display-1 mb-3">📊</div>
                <h1 className="display-4 fw-bold mb-3">Attendance Portal</h1>
                <p className="fs-5 opacity-75">
                  Track attendance efficiently with our modern solution
                </p>
              </div>
              
              <div className="row g-3 mt-4">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">✅</span>
                    <span>Real-time tracking</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">📈</span>
                    <span>Detailed analytics</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">👥</span>
                    <span>Multi-role support</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4">🔒</span>
                    <span>Secure access</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center p-4" style={{ minHeight: '100vh' }}>
            <Card className="border-0 shadow-lg" style={{ maxWidth: '450px', width: '100%' }}>
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Welcome Back!</h2>
                  <p className="text-muted">Sign in to continue</p>
                </div>

                {error && (
                  <Alert variant="danger" className="rounded-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                      className="rounded-3"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" label="Remember me" />
                    <a href="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-100 rounded-3 fw-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-muted">
                      New to Attendance Portal?{' '}
                      <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#667eea' }}>
                        Create account
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login