// src/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    clearAuthToken: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;

export default authSlice.reducer;
