import { redirect } from "next/navigation";

export default function CandidateLayout({ children }) {
  redirect("/student/dashboard");
  return children;
}
