import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";

export function PanelShell({ panel, children }) {
  return (
    <div className="min-h-dvh bg-[var(--background-color)] text-foreground">
      <div className="flex min-h-dvh flex-col">
        <AppHeader panel={panel} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-8">{children}</div>
        </main>
        <AppFooter />
      </div>
    </div>
  );
}
