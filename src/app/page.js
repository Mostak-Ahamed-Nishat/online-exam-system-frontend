import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const panel = cookies().get("panel")?.value;
  const isLoggedIn = cookies().get("mock_session")?.value === "1";

  if (!isLoggedIn) {
    redirect("/login");
  }

  redirect(panel === "student" ? "/student/dashboard" : "/admin/dashboard");
}
