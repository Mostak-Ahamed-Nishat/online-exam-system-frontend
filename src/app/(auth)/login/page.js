import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-16rem)] max-w-[571px] items-center justify-center px-4">
      <div className="w-full rounded-2xl border background-color p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mx-auto w-full max-w-[507px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
