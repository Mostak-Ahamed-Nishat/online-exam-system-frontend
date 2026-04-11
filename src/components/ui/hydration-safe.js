"use client";

import { useEffect, useState } from "react";
import { LumaSpin } from "./luma-spin";

export function HydrationSafe({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section
        className="flex min-h-dvh w-full items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Loading application"
      >
        <LumaSpin className="h-8 w-8" />
      </section>
    );
  }

  return children;
}

