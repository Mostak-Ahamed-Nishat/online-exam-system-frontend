import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthAccessToken = (state) => state.auth.accessToken;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthUserRole = (state) => state.auth.user?.role ?? null;
