import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice.js'; 

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
});