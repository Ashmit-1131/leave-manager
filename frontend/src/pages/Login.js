import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Where to redirect after successful login:
  // - if a "from" location was provided (e.g., action link), use that
  // - otherwise, go to role-based default
  const getDefaultRedirect = () => (auth?.user?.role === 'admin' ? '/admin' : '/dashboard');
  const fromPath = location.state?.from?.pathname ? `${location.state.from.pathname || '/'}` : null;

  useEffect(() => {
    // If already logged in, redirect immediately
    if (auth && auth.user) {
      const dest = fromPath || getDefaultRedirect();
      navigate(dest, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]); // only run when auth.user changes

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(login(form)).unwrap();
      // on success, the useEffect above will perform the navigation
    } catch (err) {
      const msg = err?.message || (err?.payload && err.payload.message) || 'Login failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
        <form onSubmit={submit}>
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex items-center justify-between mt-4">
            <Button type="submit" className="flex items-center" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Link to="/register" className="text-sm text-indigo-600 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
