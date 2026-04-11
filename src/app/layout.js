import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

export const metadata = {
  title: "Online Exam System",
  description: "Admin + Candidate portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

