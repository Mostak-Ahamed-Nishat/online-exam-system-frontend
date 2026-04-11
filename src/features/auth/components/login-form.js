"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "../validation/login-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function setCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax`;
}

const MOCK_ADMIN_CREDENTIALS = {
  email: "admin@akij.com",
  password: "admin123",
};

const MOCK_STUDENT_CREDENTIALS = {
  email: "student@akij.com",
  password: "student123",
};

function resolveRole(values) {
  const emailOrId = values.email.trim().toLowerCase();
  const password = values.password.trim();

  if (emailOrId === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password) {
    return "admin";
  }

  if (emailOrId === MOCK_STUDENT_CREDENTIALS.email && password === MOCK_STUDENT_CREDENTIALS.password) {
    return "student";
  }

  return null;
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    // Mock auth with role-based redirect.
    if (!values.email.trim() || !values.password.trim()) return;

    const role = resolveRole(values);
    if (!role) {
      toast.error("Invalid credentials");
      return;
    }

    setCookie("panel", role);
    setCookie("mock_session", "1");

    toast.success("Signed in");
    router.push(role === "student" ? "/student/dashboard" : "/admin/dashboard");
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

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
              className="absolute inset-y-0 right-3 inline-flex items-center text-[#A6A6A6] hover:text-[#4B5563]"
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
          disabled={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
