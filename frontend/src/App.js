import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminRequests from './pages/admin/AdminRequests';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './components/layouts/MainLayout';

// New pages for email-action flow
import ActionPage from './pages/ActionPage';
import ActionResult from './pages/ActionResult';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public action link used from emails.
          ActionPage will redirect to /login if user is not authenticated,
          and after login the user will be returned to this route. */}
      <Route path="/action/leave/:id" element={<ActionPage />} />

      {/* Friendly result page shown after approve/reject */}
      <Route path="/action-success" element={<ActionResult />} />

      {/* Protected: any authenticated user */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<EmployeeDashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-history" element={<LeaveHistory />} />

          {/* admin nested routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<AdminEmployees />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">404 - Page not found</div>} />
    </Routes>
  );
}
