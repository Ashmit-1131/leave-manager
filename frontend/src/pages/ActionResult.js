// src/pages/ActionResult.jsx
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ActionResult() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const status = (params.get('status') || '').toLowerCase(); // 'approved' or 'rejected'
  const message = status === 'approved'
    ? 'The leave request was approved successfully.'
    : status === 'rejected'
      ? 'The leave request was rejected.'
      : 'The action was recorded.';

  const user = useSelector(s => s.auth.user);
  const navigate = useNavigate();

  // Choose smart CTA depending on user role
  const primaryLink = user?.role === 'admin' ? '/admin/requests' : '/dashboard';
  const primaryLabel = user?.role === 'admin' ? 'Back to Admin Requests' : 'Back to Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-6 text-center">
        <div className="mb-4">
          {status === 'approved' && (
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'rejected' && (
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          {!['approved','rejected'].includes(status) && (
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          {status === 'approved' ? 'Leave Approved' : status === 'rejected' ? 'Leave Rejected' : 'Action Completed'}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={primaryLink}
            className="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-700 inline-block"
          >
            {primaryLabel}
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Go back
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          If you were redirected here from an email link you may need to sign in to see the updated request in-app.
        </p>
      </div>
    </div>
  );
}
