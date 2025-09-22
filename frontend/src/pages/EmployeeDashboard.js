import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMyLeaves } from '../redux/slices/leavesSlice';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const leaves = useSelector(s => s.leaves.myLeaves);
  const user = useSelector(s => s.auth.user);

  useEffect(() => { dispatch(fetchMyLeaves()); }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
          <p className="text-sm text-gray-600">Department: {user?.department || 'N/A'}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/apply-leave" className="px-4 py-2 bg-brand-500 text-white rounded">Apply Leave</Link>
          <Link to="/leave-history" className="px-4 py-2 border rounded">View History</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Casual Balance</div>
          <div className="text-2xl font-semibold">{user?.leaveBalance?.casual ?? '-'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Privilege Balance</div>
          <div className="text-2xl font-semibold">{user?.leaveBalance?.privilege ?? '-'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Pending Requests</div>
          <div className="text-2xl font-semibold">{(leaves || []).filter(l=>l.status==='Pending').length}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Requests</h2>
        <div className="space-y-2">
          {(leaves || []).slice(0,5).map(l => (
            <div key={l._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{l.type} ({l.category})</div>
                <div className="text-sm text-gray-500">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</div>
              </div>
              <div className="text-sm">{l.status}</div>
            </div>
          ))}
          {(leaves || []).length === 0 && <div className="text-sm text-gray-500">No requests yet</div>}
        </div>
      </div>
    </div>
  );
}
