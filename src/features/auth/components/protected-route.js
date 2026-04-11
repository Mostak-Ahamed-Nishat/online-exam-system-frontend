"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "@/store/api/authApi";
import { Spinner } from "@/components/ui/spinner";
import {
  clearAuth,
  selectAuthIsHydrated,
  setUser,
} from "@/store/slices/authSlice";
import { clearClientSession, setClientCookie } from "../utils/session";

export function ProtectedRoute({ allowedRole, children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isHydrated = useSelector(selectAuthIsHydrated);
  const [hasClientSessionCookie, setHasClientSessionCookie] = useState(false);
  const [cookieChecked, setCookieChecked] = useState(false);

  const redirectToLogin = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
      return;
    }
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    setHasClientSessionCookie(document.cookie.includes("app_session=1"));
    setCookieChecked(true);
  }, []);

  const shouldSkipMeQuery = !isHydrated || !cookieChecked || !hasClientSessionCookie;

  const { data, isLoading, isError } = useMeQuery(undefined, {
    skip: shouldSkipMeQuery,
  });

  useEffect(() => {
    if (!isHydrated || !cookieChecked) return;
    if (!hasClientSessionCookie) {
      dispatch(clearAuth());
      clearClientSession();
      redirectToLogin();
      return;
    }
    if (isLoading) return;

    if (isError || !data?.role) {
      dispatch(clearAuth());
      clearClientSession();
      redirectToLogin();
      return;
    }

    dispatch(setUser(data));
    const resolvedPanel = data.role === "ADMIN" ? "admin" : "student";
    setClientCookie("panel", resolvedPanel);
    setClientCookie("app_session", "1");

    if (allowedRole && data.role !== allowedRole) {
      router.replace(data.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [
    allowedRole,
    cookieChecked,
    data,
    dispatch,
    hasClientSessionCookie,
    isError,
    isHydrated,
    isLoading,
    redirectToLogin,
    router,
  ]);

  if (!isHydrated || !cookieChecked || (hasClientSessionCookie && isLoading)) {
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

  if (!hasClientSessionCookie || isError || !data?.role) {
    return null;
  }

  return children;
}
