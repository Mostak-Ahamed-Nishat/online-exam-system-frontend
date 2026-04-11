"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { ChevronDown, User } from "lucide-react";
import { HeaderLogo } from "@/components/brand/header-logo";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { cn } from "@/lib/utils";
import { selectAuthUser } from "@/store/slices/authSlice";

export function AppHeader({ panel = "admin" }) {
  const pathname = usePathname();
  const isAuthPage = panel === "auth";
  const isStudentPanel = panel === "student";
  const isAdminPanel = panel === "admin";
  const authUser = useSelector(selectAuthUser);
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const homeHref =
    panel === "student"
      ? "/student/dashboard"
      : panel === "auth"
        ? "/login"
        : "/admin/dashboard";
  const displayName = authUser?.fullName || authUser?.name || "User";
  const displayStudentId = authUser?.studentId || authUser?.id || "N/A";
  const safePathname = mounted ? pathname : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-inputfield)] bg-[var(--header-bg)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4">
        <div className="flex flex-1 items-center gap-3">
          <HeaderLogo href={homeHref} />
          {isAdminPanel ? (
            <nav
              className="hidden items-center gap-5 md:flex"
              aria-label="Admin navigation"
            >
              <Link
                href="/admin/dashboard"
                className={cn(
                  "text-base font-normal leading-6 text-[#130B2C] transition-opacity hover:opacity-80",
                  safePathname === "/admin/dashboard" ? "font-medium" : "",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/exams/create"
                className={cn(
                  "text-base font-normal leading-6 text-[#130B2C] transition-opacity hover:opacity-80",
                  safePathname?.startsWith("/admin/exams/create")
                    ? "font-medium"
                    : "",
                )}
              >
                Online Test
              </Link>
            </nav>
          ) : null}
        </div>

        {isAuthPage ? (
          <div className="flex-1 text-center text-sm font-normal leading-5 text-[var(--text-primary)] md:text-2xl md:leading-8">
            Akij Resource
          </div>
        ) : isStudentPanel ? (
          <div className="flex-1 text-center text-sm font-normal leading-5 text-[var(--text-primary)] md:text-xl md:leading-7 lg:text-2xl lg:leading-8">
            Akij Resource
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex flex-1 justify-end">
          {!isAuthPage ? (
            <div
              ref={profileMenuRef}
              className="relative flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full px-1 text-[var(--icon-gray)] transition-opacity hover:opacity-90"
                aria-label="Open user menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f3f7] text-[var(--icon-gray)]">
                  <User className="h-5 w-5" />
                </span>
                <div className="hidden text-left sm:block">
                  <div className="max-w-[180px] truncate text-sm font-semibold leading-5 text-[var(--text-primary)]">
                    {displayName}
                  </div>
                  <div className="max-w-[180px] truncate text-[11px] font-normal leading-4 text-[var(--test-subtext)]">
                    Ref.ID: {displayStudentId}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "hidden h-4 w-4 shrink-0 self-center transition-transform sm:block",
                    isProfileMenuOpen ? "rotate-180" : "",
                  )}
                />
              </button>

              {isProfileMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[170px] rounded-[10px] border border-[var(--border-inputfield)] bg-[var(--background-white)] p-2 shadow-[0_10px_25px_rgba(15,23,42,0.12)]"
                >
                  <LogoutButton className="w-full justify-start border-transparent px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--background-color)]" />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
