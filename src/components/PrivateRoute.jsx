import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, adminOnly = false, teacherOnly = false }) => {
  const { token, user, isAdmin, isTeacher } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  if (teacherOnly && !isTeacher() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PrivateRoute