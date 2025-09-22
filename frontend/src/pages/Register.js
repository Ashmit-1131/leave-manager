import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeId: '', department: '', role: 'employee' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered. Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={submit}>
          <Input label="Name" name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input label="Employee ID" name="employeeId" value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})} />
          <Input label="Department" name="department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} />
          <Input label="Email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <Input label="Password" type="password" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full rounded-md border p-2">
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
