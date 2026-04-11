import { redirect } from "next/navigation";

export default function EmployerLayout({ children }) {
  redirect("/admin/dashboard");
  return children;
}
