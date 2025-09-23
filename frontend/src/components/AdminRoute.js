// src/components/AdminRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);

  if (!token) {
    // not authenticated -> redirect to login, preserve location handled by router if needed
    return <Navigate to="/login" replace />;
  }
  if (!user || user.role !== 'admin') {
    // authenticated but not admin -> go to employee dashboard
    return <Navigate to="/dashboard" replace />;
  }
  // authorized
  return <Outlet />;
}
