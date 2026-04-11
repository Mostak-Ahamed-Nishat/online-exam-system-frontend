"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { HeaderLogo } from "@/components/brand/header-logo";
import { LogoutButton } from "@/features/auth/components/logout-button";

export function AppHeader({ panel = "admin" }) {
  const isAuthPage = panel === "auth";
  const sectionLabel = "Dashboard";

  const homeHref = panel === "student" ? "/student/dashboard" : panel === "auth" ? "/login" : "/admin/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-inputfield)] bg-[var(--header-bg)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4">
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
            <div className="flex items-center gap-2">
              <LogoutButton />
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium leading-5">User</div>
                <div className="text-[11px] text-muted-foreground leading-4">Ref. ID - 000000</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
                <User className="h-5 w-5" />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
