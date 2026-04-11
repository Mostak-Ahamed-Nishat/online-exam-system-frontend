"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "@/store/api/authApi";
import { clearAuth } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { clearClientSession } from "../utils/session";

export function LogoutButton({ className }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (_error) {
      // Intentionally continue local cleanup even when backend logout fails.
    } finally {
      dispatch(clearAuth());
      clearClientSession();
      router.replace("/login");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <LogOut className="h-3.5 w-3.5" />
      {isLoading ? "Logging Out..." : "Logout"}
    </button>
  );
}
