import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import linkReducer from '../features/links/linkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    links: linkReducer,
  },
});