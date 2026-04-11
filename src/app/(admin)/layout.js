import { PanelShell } from "@/components/layout/panel-shell";

export default function AdminLayout({ children }) {
  return <PanelShell panel="admin">{children}</PanelShell>;
}

