import React, { useEffect, useState } from 'react';
import API from '../../api/apiClient';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ totalEmployees: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res1 = await API.get('/admin/employees');
        const res2 = await API.get('/admin/leaves/pending');
        setSummary({ totalEmployees: res1.data.users.length, pending: res2.data.leaves.length });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total employees</div>
          <div className="text-2xl font-semibold">{summary.totalEmployees}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending leaves</div>
          <div className="text-2xl font-semibold">{summary.pending}</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center justify-center">
          <Link to="/admin/requests" className="px-4 py-2 bg-brand-500 text-white rounded">Review Requests</Link>
        </div>
      </div>
    </div>
  );
}
