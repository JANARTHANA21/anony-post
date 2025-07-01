import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,             // Store user info (optional)
  accessToken: null,      // Store access token
  refreshToken: null,     // Store refresh token (optional)
  isAuthenticated: false,   // Auth state
    isRefreshing: true, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user || null;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = !!accessToken;
      state.isRefreshing = false;
    },
    setRefreshingDone: (state) => {
      state.isRefreshing = false;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isRefreshing = false;
    },
  },
});

export const { setCredentials, logout ,setRefreshingDone} = authSlice.actions;

export default authSlice.reducer;