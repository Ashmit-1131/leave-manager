// src/pages/ActionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';

export default function ActionPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tokenUser = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to login and preserve return path
    if (!tokenUser) {
      navigate('/login', { state: { from: location }, replace: true });
      return;
    }

    // fetch leave details
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/leaves/${id}`);
        setLeave(res.data.leave);
      } catch (err) {
        console.error(err);
        alert(err?.response?.data?.message || 'Failed to load leave');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, tokenUser, navigate, location]);

  const decide = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this leave?`)) return;
    setActioning(true);
    try {
      await API.put(`/leaves/${id}/decide`, { action, comments: `${action} via frontend` });
      alert(`Leave ${action}d`);
      // redirect to relevant page (admin requests or dashboard)
      if (user?.role === 'admin') navigate('/admin/requests');
      else navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Action failed');
    } finally {
      setActioning(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!leave) return <div className="p-6">Leave not found or you are not authorized.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-2">Leave Request</h1>
      <div className="mb-4">
        <div className="text-sm text-gray-500">Employee</div>
        <div className="font-medium">{leave.employeeSnapshot?.name} ({leave.employeeSnapshot?.employeeId})</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-500">Type</div>
          <div className="font-medium">{leave.type} / {leave.category}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Dates</div>
          <div className="font-medium">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</div>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-500">Reason</div>
        <div className="font-medium">{leave.reason || 'N/A'}</div>
      </div>
      <div className="mb-4">
        <div className="text-sm text-gray-500">Status</div>
        <div className="font-medium">{leave.status}</div>
      </div>

      {/* Show Approve/Reject only to authorized users (admin or assigned manager) */}
      { (user && (user.role === 'admin' || String(user._id) === String(leave.assignedTo))) && leave.status === 'Pending' && (
        <div className="flex gap-3">
          <Button onClick={() => decide('approve')} className="bg-green-600 hover:bg-green-700">Approve</Button>
          <Button onClick={() => decide('reject')} className="bg-red-600 hover:bg-red-700">Reject</Button>
        </div>
      )}

      {/* If not authorized */}
      {user && !(user.role === 'admin' || String(user._id) === String(leave.assignedTo)) && (
        <div className="text-sm text-gray-600">You are not authorized to decide this request.</div>
      )}
    </div>
  );
}
