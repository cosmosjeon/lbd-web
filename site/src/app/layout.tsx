import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "LBD",
  description: "Let's Be Developers — 공식 웹사이트",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased ${inter.className}`}>
        <a href="#main" className="skip-link">본문 바로가기</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
