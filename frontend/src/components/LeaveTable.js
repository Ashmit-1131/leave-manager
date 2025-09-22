import React from 'react';

export default function LeaveTable({ leaves = [], onDecide }) {
  if (!leaves || leaves.length === 0) return <p>No leaves found</p>;
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Status</th><th>Action</th></tr>
      </thead>
      <tbody>
        {leaves.map(l => (
          <tr key={l._id}>
            <td>{l.employeeSnapshot?.name || l.employee?.name || '—'}</td>
            <td>{l.type} / {l.category}</td>
            <td>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
            <td>{l.days}</td>
            <td>{l.status}</td>
            <td>
              {onDecide && l.status === 'Pending' && (
                <>
                  <button onClick={()=>onDecide(l._id,'approve')}>Approve</button>
                  <button onClick={()=>onDecide(l._id,'reject')}>Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
