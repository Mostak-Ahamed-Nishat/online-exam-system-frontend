import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FooterLogo } from "@/components/brand/footer-logo";

export function AppFooter() {
  return (
    <footer className="mt-auto w-full bg-[var(--footer-bg)] text-[var(--test-white)] ">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:max-h-[80px]">
        <div className="flex items-center gap-3">
          <FooterLogo />
          <div className="text-sm">
            <div className="opacity-80">Powered by</div>
            <div className="font-semibold tracking-wide">AKIJ RESOURCE</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-6">
          <div className="opacity-80">Helpline</div>
          <Link
            href="tel:+88011020202505"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Phone className="h-4 w-4 opacity-80" />
            +88 011020202505
          </Link>
          <Link
            href="mailto:support@akij.work"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <Mail className="h-4 w-4 opacity-80" />
            support@akij.work
          </Link>
        </div>
      </div>
    </footer>
  );
}
