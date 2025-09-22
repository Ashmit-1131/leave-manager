import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/apiClient';

export const fetchMyLeaves = createAsyncThunk('leaves/fetchMy', async () => {
  const res = await API.get('/leaves/me');
  return res.data.leaves;
});

export const applyLeave = createAsyncThunk('leaves/apply', async (payload) => {
  const res = await API.post('/leaves', payload);
  return res.data.leave;
});

export const fetchPending = createAsyncThunk('leaves/fetchPending', async () => {
  const res = await API.get('/leaves/pending');
  return res.data.leaves;
});

const leavesSlice = createSlice({
  name: 'leaves',
  initialState: { myLeaves: [], pending: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLeaves.fulfilled, (state, action) => { state.myLeaves = action.payload; })
      .addCase(applyLeave.fulfilled, (state, action) => { state.myLeaves.unshift(action.payload); })
      .addCase(fetchPending.fulfilled, (state, action) => { state.pending = action.payload; });
  }
});

export default leavesSlice.reducer;
