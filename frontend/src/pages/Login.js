import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (auth.user) {
      // redirect based on role
      if (auth.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [auth.user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(form)).unwrap();
      // navigation handled by useEffect
    } catch (err) {
      alert('Login failed: ' + (err?.message || 'unknown'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        <form onSubmit={submit}>
          <Input label="Email" name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" />
          <Input label="Password" type="password" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          <div className="flex items-center justify-between">
            <Button type="submit">Sign in</Button>
            <Link to="/register" className="text-sm text-indigo-600 hover:underline">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
