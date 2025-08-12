"use client";

import Link from "next/link";
import { useScrolledHeader } from "@/app/(lib)/useScrolledHeader";

export function SiteHeader() {
  useScrolledHeader("header");
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-[height,background-color,backdrop-filter] duration-[var(--duration-fast)] h-[72px] data-[scrolled=true]:h-[56px] bg-white/0 data-[scrolled=true]:bg-white/90 backdrop-blur-0 data-[scrolled=true]:backdrop-blur"
      role="banner"
    >
      <div className="container h-full flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight underline-offset-4 hover:underline" aria-label="LBD 홈">
          LBD
        </Link>
        <nav className="hidden md:flex gap-6 text-sm" aria-label="주요 메뉴">
          <Link href="/projects" className="hover:underline underline-offset-4 focus-visible:underline">프로젝트</Link>
          <Link href="/archive" className="hover:underline underline-offset-4 focus-visible:underline">아카이브</Link>
          <Link href="/team" className="hover:underline underline-offset-4 focus-visible:underline">팀</Link>
          <Link href="/subscribe" className="hover:underline underline-offset-4 focus-visible:underline">구독</Link>
        </nav>
      </div>
    </header>
  );
}


