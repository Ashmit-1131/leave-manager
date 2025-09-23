// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/apiClient';

// login thunk: returns res.data on success, rejectWithValue(serverPayload) on error
export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/auth/login', payload);
    return res.data; // expected { message, token, user }
  } catch (err) {
    // prefer server response payload if present
    const serverPayload = err.response?.data || { message: err.message || 'Login failed' };
    return thunkAPI.rejectWithValue(serverPayload);
  }
});

// register thunk: same pattern
export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    const serverPayload = err.response?.data || { message: err.message || 'Registration failed' };
    return thunkAPI.rejectWithValue(serverPayload);
  }
});

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    // new reducer: update leave balances for current user
    updateLeaveBalance: (state, action) => {
      if (state.user) {
        // action.payload should be an object like { casual: Number, privilege: Number }
        state.user.leaveBalance = action.payload;
        try {
          localStorage.setItem('user', JSON.stringify(state.user));
        } catch (e) {
          // ignore localStorage write errors
          // (optionally log in dev)
          // console.warn('Failed to persist user to localStorage', e);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.payload expected { message, token, user }
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        // action.payload is server payload (if rejectWithValue used), otherwise fallback to action.error.message
        state.error = (action.payload && action.payload.message) || action.error?.message || 'Login failed';
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'registered';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload && action.payload.message) || action.error?.message || 'Registration failed';
      });
  }
});

export const { logout, updateLeaveBalance } = authSlice.actions;
export default authSlice.reducer;
