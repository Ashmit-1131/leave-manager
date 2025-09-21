import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/apiClient';

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  const res = await API.post('/auth/login', payload);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async (payload) => {
  const res = await API.post('/auth/register', payload);
  return res.data;
});

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(register.fulfilled, (state) => { state.status = 'registered'; })
      .addCase(register.rejected, (state, action) => { state.error = action.error.message; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
