// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiClient';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../components/ToastProvider';

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', employeeId: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const validate = () => {
    const { name, email, password, employeeId, department } = form;
    if (!name || !email || !password || !employeeId || !department) {
      setErrorMsg('All fields are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email.');
      return false;
    }
    if (password.length < 5) {
      setErrorMsg('Password must be at least 5 characters long.');
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      toast.push(res?.data?.message || 'Registered. Please login.', 'info');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}

        <form onSubmit={submit}>
          <Input label="Name" name="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Input label="Employee ID" name="employeeId" value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})} />
          <Input label="Department" name="department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})} />
          <Input label="Email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <Input label="Password" type="password" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
