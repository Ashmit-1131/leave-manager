// src/components/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function MainLayout() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-semibold text-indigo-700">LeaveSys</div>
            <nav className="hidden md:flex space-x-3">
              <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-indigo-700 font-medium' : 'text-gray-600'}>Dashboard</NavLink>
              <NavLink to="/apply-leave" className={({isActive}) => isActive ? 'text-indigo-700 font-medium' : 'text-gray-600'}>Apply Leave</NavLink>
              <NavLink to="/leave-history" className={({isActive}) => isActive ? 'text-indigo-700 font-medium' : 'text-gray-600'}>My History</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" className={({isActive}) => isActive ? 'text-indigo-700 font-medium' : 'text-gray-600'}>Admin</NavLink>}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 hidden sm:block">{user?.name || ''}</div>

            <div className="md:hidden">
              <button onClick={() => setOpen(v => !v)} className="p-2 rounded border">
                {open ? 'Close' : 'Menu'}
              </button>
            </div>

            <button
              onClick={() => { dispatch(logout()); window.location.href = '/login'; }}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 pb-4 pt-2 space-y-2">
              <NavLink to="/dashboard" onClick={()=>setOpen(false)} className="block">Dashboard</NavLink>
              <NavLink to="/apply-leave" onClick={()=>setOpen(false)} className="block">Apply Leave</NavLink>
              <NavLink to="/leave-history" onClick={()=>setOpen(false)} className="block">My History</NavLink>
              {user?.role === 'admin' && <NavLink to="/admin" onClick={()=>setOpen(false)} className="block">Admin</NavLink>}
            </div>
          </div>
        )}
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
