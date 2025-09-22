import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function MainLayout() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-semibold text-brand-700">LeaveSys</div>
            <nav className="hidden md:flex space-x-3">
              <NavLink to="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</NavLink>
              <NavLink to="/apply-leave" className="text-gray-600 hover:text-gray-900">Apply Leave</NavLink>
              <NavLink to="/leave-history" className="text-gray-600 hover:text-gray-900">My History</NavLink>
              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin" className="text-gray-600 hover:text-gray-900">Admin</NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 hidden sm:block">{user?.name || ''}</div>
            <button
              onClick={() => { dispatch(logout()); window.location.href = '/login'; }}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-sm text-gray-500">© {new Date().getFullYear()} LeaveSys</div>
      </footer>
    </div>
  );
}
