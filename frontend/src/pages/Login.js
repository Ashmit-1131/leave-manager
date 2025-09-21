import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: ''});

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(login(form)).unwrap();
      if (res.user.role === 'admin') navigate('/admin');
      else navigate('/employee');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div><input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
