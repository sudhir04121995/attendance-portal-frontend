import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AttendanceMark from './components/AttendanceMark'
import AttendanceReport from './components/AttendanceReport'
import StudentDashboard from './components/StudentDashboard'
import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

// Loading spinner component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading your session...</p>
    </div>
  </div>
)

const AppContent = () => {
  const { token, user, isAdmin, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            {isAdmin() ? <AdminPanel /> : <StudentDashboard />}
          </PrivateRoute>
        } />
        
        <Route path="/mark-attendance" element={
          <PrivateRoute adminOnly>
            <AttendanceMark />
          </PrivateRoute>
        } />
        
        <Route path="/reports" element={
          <PrivateRoute teacherOnly>
            <AttendanceReport />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute adminOnly>
            <AdminPanel />
          </PrivateRoute>
        } />
        
        <Route path="/my-attendance" element={
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App