import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves } from '../redux/slices/leavesSlice';

export default function LeaveHistory() {
  const dispatch = useDispatch();
  const leaves = useSelector(s => s.leaves.myLeaves);

  useEffect(()=>{ dispatch(fetchMyLeaves()); }, [dispatch]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Leave History</h1>
      <div className="space-y-3">
        {(leaves || []).map(l => (
          <div key={l._id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <div className="font-medium">{l.type} / {l.category}</div>
              <div className="text-sm text-gray-500">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</div>
            </div>
            <div className="text-sm font-medium">{l.status}</div>
          </div>
        ))}
        {(leaves || []).length === 0 && <div className="text-sm text-gray-500">No leaves found</div>}
      </div>
    </div>
  );
}
