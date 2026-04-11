import { PanelShell } from "@/components/layout/panel-shell";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function StudentLayout({ children }) {
  const cookieStore = cookies();
  const panel = cookieStore.get("panel")?.value;
  const hasSession = cookieStore.get("app_session")?.value === "1";
  const hasAccess = Boolean(cookieStore.get("auth_access")?.value);

  if (!hasSession || !hasAccess || !panel) {
    redirect("/login");
  }

  if (panel !== "student") {
    redirect("/admin/dashboard");
  }

  return (
    <PanelShell panel="student">
      <ProtectedRoute allowedRole="CANDIDATE">
        {children}
      </ProtectedRoute>
    </PanelShell>
  );
}
