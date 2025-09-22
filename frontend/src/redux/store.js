import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import leavesReducer from './slices/leavesSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    // leaves: leavesReducer
  }
});
