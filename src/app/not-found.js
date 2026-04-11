import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[50vh] w-full max-w-[960px] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Page Not Found</h1>
      <p className="text-sm text-[var(--test-subtext)]">
        The page you are looking for does not exist or is no longer available.
      </p>
      <Link
        href="/login"
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--button-primary)] px-6 text-sm font-semibold text-[var(--button-white)] transition-opacity hover:opacity-95"
      >
        Back To Login
      </Link>
    </section>
  );
}
