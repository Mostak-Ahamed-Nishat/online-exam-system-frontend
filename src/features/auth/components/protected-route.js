"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useMeQuery } from "@/store/api/authApi";
import { Spinner } from "@/components/ui/spinner";
import { clearAuth, setUser } from "@/store/slices/authSlice";
import { clearClientSession, setClientCookie } from "../utils/session";

export function ProtectedRoute({ allowedRole, panel, children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError } = useMeQuery(undefined, {
    skip: !mounted,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
  }, [allowedRole, data, dispatch, isError, isLoading, mounted, panel, router]);

  if (!mounted || isLoading) {
    return (
      <section
        className="flex w-full items-center justify-center py-10"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <Spinner className="h-5 w-5 text-[var(--text-primary)]" />
        <span className="sr-only">Checking authentication</span>
      </section>
    );
  }

  if (isError || !data?.role) {
    return null;
  }

  return children;
}
