"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { HeaderLogo } from "@/components/brand/header-logo";
import { LogoutButton } from "@/features/auth/components/logout-button";

export function AppHeader({ panel = "admin" }) {
  const isAuthPage = panel === "auth";
  const sectionLabel = "Dashboard";
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const homeHref = panel === "student" ? "/student/dashboard" : panel === "auth" ? "/login" : "/admin/dashboard";

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
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
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-3 px-4">
        <HeaderLogo href={homeHref} />

        {isAuthPage ? (
          <div className="flex-1 text-center text-lg font-semibold tracking-wide text-foreground">
            Akij Resource
          </div>
        ) : (
          <div className="ml-2 hidden text-sm font-medium text-muted-foreground md:block">
            {sectionLabel}
          </div>
        )}

        <div className="flex-1" />

        {!isAuthPage ? (
          <>
            <div ref={profileMenuRef} className="relative flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium leading-5">User</div>
                <div className="text-[11px] text-muted-foreground leading-4">Ref. ID - 000000</div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground transition-opacity hover:opacity-90"
                aria-label="Open user menu"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
              >
                <User className="h-5 w-5" />
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
          </>
        ) : null}
      </div>
    </header>
  );
}

