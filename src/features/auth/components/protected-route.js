"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMeQuery } from "@/store/api/authApi";
import { clearAuth, setUser } from "@/store/slices/authSlice";
import { clearClientSession, setClientCookie } from "../utils/session";

export function ProtectedRoute({ allowedRole, panel, children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.role) {
      dispatch(clearAuth());
      clearClientSession();
      router.replace("/login");
      return;
    }

    dispatch(setUser(data));
    const resolvedPanel = data.role === "ADMIN" ? "admin" : "student";
    setClientCookie("panel", resolvedPanel);
    setClientCookie("app_session", "1");

    if (allowedRole && data.role !== allowedRole) {
      router.replace(data.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [allowedRole, data, dispatch, isError, isLoading, router]);

  if (isLoading) {
    return (
      <div className="py-10 text-sm text-muted-foreground">Checking authentication...</div>
    );
  }

  if (isError || !data?.role) {
    return null;
  }

  return children;
}

