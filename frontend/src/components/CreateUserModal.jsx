// src/components/CreateUserModal.jsx
import React, { useState } from 'react';
import API from '../api/apiClient';
import { useToast } from '../components/ToastProvider';

/**
 * Props:
 * - open: boolean
 * - onClose(): function
 * - onCreated(): function
 * - employees: array (for manager select)
 */
export default function CreateUserModal({ open, onClose = () => {}, onCreated = () => {}, employees = [] }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', employeeId: '', department: '', password: '', role: 'employee', managerId: ''
  });
  const toast = useToast();

  if (!open) return null;

  const validate = () => {
    const { name, email, employeeId, department, password } = form;
    if (!name.trim() || !email.trim() || !employeeId.trim() || !department.trim() || !password) {
      toast.push('Please fill all required fields', 'error'); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.push('Enter valid email', 'error'); return false;
    }
    if (password.length < 5) {
      toast.push('Password must be at least 5 characters', 'error'); return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validate()) return;
    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        employeeId: form.employeeId.trim(),
        department: form.department.trim(),
        password: form.password,
        role: form.role,
        managerId: form.managerId || undefined
      };
      await API.post('/admin/create', payload);
      toast.push('User created successfully', 'info');
      setForm({ name: '', email: '', employeeId: '', department: '', password: '', role: 'employee', managerId: '' });
      onCreated();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to create user';
      toast.push(msg, 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => !creating && onClose()} />
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 z-50">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create User</h3>
          <button onClick={() => !creating && onClose()} className="text-gray-500">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Employee ID *</label>
              <input value={form.employeeId} onChange={e => setForm(prev => ({ ...prev, employeeId: e.target.value }))} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department *</label>
              <input value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <input type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} className="w-full border rounded p-2" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))} className="w-full border rounded p-2">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Manager (optional)</label>
              <select value={form.managerId} onChange={e => setForm(prev => ({ ...prev, managerId: e.target.value }))} className="w-full border rounded p-2">
                <option value="">— none —</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} • {emp.employeeId}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => !creating && onClose()} className="px-4 py-2 rounded border" disabled={creating}>Cancel</button>
            <button onClick={submit} className="px-4 py-2 rounded text-white bg-brand-500" disabled={creating}>
              {creating ? 'Creating…' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
