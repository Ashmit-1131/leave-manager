
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
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const getDefaultRedirect = () => (auth?.user?.role === 'admin' ? '/admin' : '/dashboard');
  const fromPath = location.state?.from?.pathname ? `${location.state.from.pathname}` : null;

  useEffect(() => {
    if (auth && auth.user) {
      const dest = fromPath || getDefaultRedirect();
      navigate(dest, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const validate = () => {
    if (!form.email || !form.password) {
      setErrorMsg('Email and password are required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      // dispatch returns either payload (fulfilled) or throws rejected value via unwrap()
      const result = await dispatch(login(form)).unwrap();
      if (result && result.token) {
        localStorage.setItem('token', result.token);
      }
      setSuccessMsg(result?.message || 'Login successful');
      // navigation handled by useEffect when auth.user updates
    } catch (err) {
      // err here is the rejected value (if rejectWithValue used) or an Error object
      const msg =
        (err && err.message) || // err may already be an object with message
        (err && err.payload && err.payload.message) || // defensive, although unwrap gives the payload directly
        'Login failed';
      // better: if err is an object returned by rejectWithValue, unwrap() throws that object directly
      // so check for err.message above suffices for most cases
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}
        {successMsg && <div className="mb-3 text-sm text-green-600">{successMsg}</div>}

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
