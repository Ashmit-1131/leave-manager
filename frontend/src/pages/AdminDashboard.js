import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPending } from '../redux/slices/leavesSlice';
import API from '../api/apiClient';
import LeaveTable from '../components/LeaveTable';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pending = useSelector(s => s.leaves.pending);
  const user = useSelector(s => s.auth.user);

  useEffect(()=>{ dispatch(fetchPending()); },[dispatch]);

  const decide = async (id, action) => {
    try {
      await API.put(`/leaves/${id}/decide`, { action, comments: `${action} by admin` });
      alert(`Leave ${action}d`);
      dispatch(fetchPending());
    } catch (err) { alert('Error deciding'); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <div>{user?.name} <button onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</button></div>
      <h3>Pending Leaves</h3>
      <LeaveTable leaves={pending} onDecide={decide}/>
    </div>
  );
}
