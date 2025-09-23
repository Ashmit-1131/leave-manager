// src/pages/admin/AdminRequests.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import API from '../../api/apiClient';
import { useToast } from '../../components/ToastProvider';
import LeaveTable from '../../components/LeaveTable';
import { updateLeaveBalance } from '../../redux/slices/authSlice';

export default function AdminRequests() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  // comment modal state
  const [commentModal, setCommentModal] = useState({
    open: false,
    leaveId: null,
    action: null,
    comment: ''
  });

  const toast = useToast();
  const dispatch = useDispatch();

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/leaves/pending');
      setPending(res.data.leaves || []);
    } catch (err) {
      console.error(err);
      toast.push('Failed to load pending requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // called from LeaveTable approve/reject buttons
  const onDecideClick = (id, action) => {
    setCommentModal({ open: true, leaveId: id, action, comment: '' });
  };

  // submit decision directly (no extra confirmation)
  const submitDecision = async () => {
    const { leaveId, action, comment } = commentModal;
    try {
      const res = await API.put(`/leaves/${leaveId}/decide`, { action, comments: comment || '' });

      toast.push(`Leave ${action}d`, 'info');

      // update redux + localStorage if backend returned updated balance
      const updatedBalance = res?.data?.updatedBalance;
      if (updatedBalance) {
        try {
          dispatch(updateLeaveBalance(updatedBalance));
          const stored = localStorage.getItem('user');
          if (stored) {
            const user = JSON.parse(stored);
            user.leaveBalance = updatedBalance;
            localStorage.setItem('user', JSON.stringify(user));
          }
        } catch (e) {
          console.warn('updateLeaveBalance failed', e);
        }
      }

      // reload pending list and close modal
      await load();
      setCommentModal({ open: false, leaveId: null, action: null, comment: '' });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed';
      toast.push(msg, 'error');
      console.error(err);
      // keep modal open so admin can edit and retry
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Pending Leave Requests</h1>

      {loading ? (
        <div className="p-4 text-sm text-gray-500">Loading...</div>
      ) : (
        <LeaveTable leaves={pending} onDecide={onDecideClick} />
      )}

      {/* Comment Modal */}
      {commentModal.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setCommentModal({ open: false, leaveId: null, action: null, comment: '' })}
          />

          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mx-4 z-50">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">
                {commentModal.action === 'approve' ? 'Approve leave' : 'Reject leave'}
              </h3>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter comments for {commentModal.action} (optional):
              </label>
              <textarea
                value={commentModal.comment}
                onChange={e => setCommentModal(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full border rounded p-2 text-sm"
                placeholder="Optional comments (e.g. reason for rejection)"
              />
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border"
                onClick={() => setCommentModal({ open: false, leaveId: null, action: null, comment: '' })}
              >
                Cancel
              </button>

              {/* Keep approve green and reject red */}
              <button
                onClick={submitDecision}
                className={
                  'px-4 py-2 rounded text-white ' +
                  (commentModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700')
                }
              >
                {commentModal.action === 'approve' ? 'Yes, approve' : 'Yes, reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
