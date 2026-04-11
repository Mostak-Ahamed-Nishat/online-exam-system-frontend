import { PanelShell } from "@/components/layout/panel-shell";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function hasValidAccessToken(token) {
  if (!token) {
    return false;
  }

  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) {
      return false;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch (_error) {
    return false;
  }
}

export default function StudentLayout({ children }) {
  const cookieStore = cookies();
  const panel = cookieStore.get("panel")?.value;
  const hasSession = cookieStore.get("app_session")?.value === "1";
  const hasAccess = hasValidAccessToken(cookieStore.get("auth_access")?.value);

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
