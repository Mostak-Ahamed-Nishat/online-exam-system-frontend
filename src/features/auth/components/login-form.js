"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSchema } from "../validation/login-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLazyMeQuery, useLoginMutation } from "@/store/api/authApi";
import { clearAuth, setCredentials, setUser } from "@/store/slices/authSlice";
import { clearClientSession, setClientCookie } from "../utils/session";

function saveAuthState(accessToken, user) {
  localStorage.setItem("access_token", accessToken);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [fetchMe, { isLoading: isFetchingMe }] = useLazyMeQuery();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    try {
      const loginRes = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      if (!loginRes?.accessToken) {
        throw new Error("Access token missing");
      }

      dispatch(setCredentials({ accessToken: loginRes.accessToken }));
      const me = await fetchMe().unwrap();

      const panel = me?.role === "ADMIN" ? "admin" : "student";
      dispatch(setUser(me));
      saveAuthState(loginRes.accessToken, me);

      setClientCookie("panel", panel);
      setClientCookie("app_session", "1");
      setClientCookie("auth_access", loginRes.accessToken);

      toast.success("Signed in");
      router.push(panel === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (_error) {
      dispatch(clearAuth());
      clearClientSession();
      toast.error("Invalid credentials");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const isAuthLoading = isSubmitting || isLoggingIn || isFetchingMe;

  return (
    <div className="w-full">
      <h1 className="text-center text-xl font-semibold">Sign In</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        aria-label="Sign in form"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email/ User ID</label>
          <Input
            {...register("email")}
            placeholder="Enter your email/User ID"
            className="h-12"
            autoComplete="username"
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{String(errors.email.message)}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input
              {...register("password")}
              placeholder="Enter your password"
              className="h-12 pr-11"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 inline-flex cursor-pointer items-center text-[var(--icon-gray)] hover:text-[var(--icon-black)]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Forget Password?
            </Link>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{String(errors.password.message)}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-foreground hover:text-primary">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
