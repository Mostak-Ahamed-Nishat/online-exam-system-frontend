import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";
import { HydrationSafe } from "@/components/ui/hydration-safe";

export function PanelShell({ panel, children }) {
  return (
    <HydrationSafe>
      <div className="min-h-dvh bg-[var(--background-color)] text-foreground">
        <div className="flex min-h-dvh flex-col">
          <AppHeader panel={panel} />
          <main className="flex-1 md:pb-24">
            <div className="mx-auto w-full max-w-7xl px-4 py-8">{children}</div>
          </main>
          <AppFooter />
        </div>
      </div>
    </HydrationSafe>
  );
}
