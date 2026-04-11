import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
  isHydrated: false,
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
      state.isHydrated = true;
    },
    setAuthHydrated: (state) => {
      state.isHydrated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, setAuthHydrated, setUser, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAuthAccessToken = (state) => state.auth.accessToken;
export const selectAuthIsHydrated = (state) => state.auth.isHydrated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthUserRole = (state) => state.auth.user?.role ?? null;
