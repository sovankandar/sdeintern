"use client"

import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import Login from "./components/Auth/Login"
import Dashboard from "./components/Dashboard/Dashboard"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import { logout } from "./features/auth/authSlice"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check token expiration
    const token = localStorage.getItem("userToken")
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]))
        if (tokenData.exp * 1000 < Date.now()) {
          dispatch(logout())
        }
      } catch (error) {
        dispatch(logout())
      }
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={<Navigate to={localStorage.getItem("userToken") ? "/dashboard" : "/login"} replace />}
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold dark:text-white">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
