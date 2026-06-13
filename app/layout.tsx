import type { Metadata } from "next";

import { Footer } from "@/src/components/layout/Footer";
import { SiteHeader } from "@/src/components/layout/SiteHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: "Home Billiards",
  description: "Prototype-informed Next.js foundation for the Home Billiards headless storefront."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
