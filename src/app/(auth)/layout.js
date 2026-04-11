import { PanelShell } from "@/components/layout/panel-shell";

export default function AuthLayout({ children }) {
  return <PanelShell panel="auth">{children}</PanelShell>;
}

