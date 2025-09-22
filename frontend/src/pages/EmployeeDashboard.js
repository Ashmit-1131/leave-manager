import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves, applyLeave } from '../redux/slices/leavesSlice';
import LeaveForm from '../components/LeaveForm';
import LeaveTable from '../components/LeaveTable';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const leaves = useSelector(state => state.leaves.myLeaves);
  const user = useSelector(s => s.auth.user);

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const onApply = async (data) => {
    try {
      await dispatch(applyLeave(data)).unwrap();
      alert('Leave applied');
    } catch (err) { alert('Error applying leave'); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Dashboard</h2>
      <div>
        <strong>{user?.name}</strong> | {user?.email}
        <button onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</button>
      </div>
      <h3>Leave Balance</h3>
      <div>Casual: {user?.leaveBalance?.casual} | Privilege: {user?.leaveBalance?.privilege}</div>

      <h3>Apply for Leave</h3>
      <LeaveForm onSubmit={onApply}/>

      <h3>Your Leave History</h3>
      <LeaveTable leaves={leaves} />
    </div>
  );
}
