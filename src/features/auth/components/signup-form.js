"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signupSchema } from "../validation/signup-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/store/api/authApi";

function resolveSignupError(error) {
  const statusCode = error?.status ?? error?.data?.statusCode;
  if (statusCode === 409) {
    return "Email already registered. Please sign in.";
  }

  if (typeof error?.data?.message === "string" && error.data.message.length > 0) {
    if (/email already registered/i.test(error.data.message)) {
      return "Email already registered. Please sign in.";
    }
    return error.data.message;
  }

  const firstValidationError = error?.data?.errors?.[0]?.message;
  if (typeof firstValidationError === "string" && firstValidationError.length > 0) {
    return firstValidationError;
  }

  return "Unable to create account";
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    try {
      const response = await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      toast.success(response?.message || "Registration successful");
      form.reset({ fullName: "", email: "", password: "" });
    } catch (error) {
      const message = resolveSignupError(error);

      if (/email already registered/i.test(message)) {
        form.setError("email", {
          type: "server",
          message,
        });
      }

      toast.error(message);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const isFormBusy = isSubmitting || isRegistering;

  return (
    <div className="w-full">
      <h1 className="text-center text-xl font-semibold">Sign Up</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        aria-label="Sign up form"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input
            {...register("fullName")}
            placeholder="Enter your full name"
            className="h-12"
            autoComplete="name"
          />
          {errors.fullName ? (
            <p className="text-xs text-destructive">{String(errors.fullName.message)}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            {...register("email")}
            placeholder="Enter your email"
            className="h-12"
            autoComplete="email"
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
              placeholder="Create a password"
              className="h-12 pr-11"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          {errors.password ? (
            <p className="text-xs text-destructive">{String(errors.password.message)}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl"
          disabled={isFormBusy}
        >
          {isFormBusy ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-foreground hover:text-primary">
          Sign In
        </Link>
      </p>
    </div>
  );
}
