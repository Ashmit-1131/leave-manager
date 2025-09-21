import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiClient';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '', employeeId: '', department: '', role: 'employee' });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Registered. Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err?.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><br/>
        <input placeholder="Employee ID" value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})}/><br/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><br/>
        <input placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/><br/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><br/>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
