import { Mail, Phone } from "lucide-react";
import { FooterLogo } from "@/components/brand/footer-logo";

export function AppFooter() {
  return (
    <footer className="mt-auto w-full bg-[var(--footer-bg)] text-[var(--test-white)] md:fixed md:bottom-0 md:left-0 md:z-30">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:max-h-20">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
          <div className="text-md lg:text-xl">
            <div className="opacity-80">Powered by</div>
          </div>
          <FooterLogo />
        </div>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-6">
          <div className="opacity-80">Helpline</div>
          <a
            href="tel:+88011020202505"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Phone className="h-4 w-4 opacity-80" />
            +88 011020202505
          </a>
          <a
            href="mailto:support@akij.work"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Mail className="h-4 w-4 opacity-80" />
            support@akij.work
          </a>
        </div>
      </div>
    </footer>
  );
}
