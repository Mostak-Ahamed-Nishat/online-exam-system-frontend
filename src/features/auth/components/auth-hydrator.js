"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthHydrated, setCredentials } from "@/store/slices/authSlice";

const TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

export function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem(TOKEN_KEY);
      const rawUser = localStorage.getItem(USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;

      if (accessToken) {
        dispatch(setCredentials({ accessToken, user }));
        return;
      }
    } catch (_error) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    dispatch(setAuthHydrated());
  }, [dispatch]);

  return null;
}
