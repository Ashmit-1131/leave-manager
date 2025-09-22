// corrected AdminRequests.js (use this instead)
import React, { useEffect, useState } from 'react';
import API from '../../api/apiClient';

export default function AdminRequests() {
  const [pending, setPending] = useState([]);

  const load = async () => {
    try {
      const res = await API.get('/admin/leaves/pending');
      setPending(res.data.leaves);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const decide = async (id, action) => {
    try {
      await API.put(`/leaves/${id}/decide`, { action, comments: `${action} by admin` });
      alert('Success');
      load();
    } catch (err) {
      alert('Failed: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Pending Leave Requests</h1>
      <div className="space-y-3">
        {pending.map(r => (
          <div key={r._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{r.employeeSnapshot?.name} • {r.type}/{r.category}</div>
              <div className="text-sm text-gray-500">{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>decide(r._id,'approve')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
              <button onClick={()=>decide(r._id,'reject')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
            </div>
          </div>
        ))}
        {pending.length === 0 && <div className="text-sm text-gray-500">No pending requests</div>}
      </div>
    </div>
  );
}
