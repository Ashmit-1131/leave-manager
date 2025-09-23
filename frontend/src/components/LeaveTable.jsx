// src/components/LeaveTable.jsx
import React from 'react';

export default function LeaveTable({ leaves = [], onDecide }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="divide-y">
        {leaves.map(l => (
          <div key={l._id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{l.employeeSnapshot?.name || l.employee?.name} • {l.type}/{l.category}</div>
              <div className="text-sm text-gray-500">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm mr-2">{l.status}</div>
              {onDecide && l.status === 'Pending' && (
                <>
                  <button onClick={() => onDecide(l._id, 'approve')} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                  <button onClick={() => onDecide(l._id, 'reject')} className="px-3 py-1 rounded bg-red-600 text-white">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
        {leaves.length === 0 && <div className="p-4 text-sm text-gray-500">No requests</div>}
      </div>
    </div>
  );
}
