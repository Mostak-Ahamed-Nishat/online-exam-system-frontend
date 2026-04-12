import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { AppToaster } from "@/components/ui/app-toaster";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Online Exam System",
  description: "Admin + Candidate portal",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} min-h-dvh bg-[var(--background-color)] text-[var(--text-primary)]`}>
        <Providers>
          {children}
          <AppToaster />
        </Providers>
      </body>
    </html>
  );
}
