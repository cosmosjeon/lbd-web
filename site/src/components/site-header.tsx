"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrolledHeader } from "@/app/(lib)/useScrolledHeader";

export function SiteHeader() {
  useScrolledHeader("header");
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-[height,background-color,backdrop-filter,color] duration-[var(--duration-fast)] h-[72px] data-[scrolled=true]:h-[56px] bg-white/0 data-[scrolled=true]:bg-black/10 backdrop-blur-0 data-[scrolled=true]:backdrop-blur-sm text-white data-[scrolled=true]:text-[color:var(--color-lbd-navy)]"
      role="banner"
    >
      <div className="container h-full flex items-center justify-between text-white data-[scrolled=true]:text-[color:var(--color-lbd-navy)]">
        <Link href="/" className="flex items-center gap-2" aria-label="LBD 홈">
          <Image src="/logo.png" alt="LBD" width={72} height={28} priority />
        </Link>
        <nav className="hidden md:flex gap-6 text-sm" aria-label="주요 메뉴">
          <Link href="/" className="hover:underline underline-offset-4 focus-visible:underline">Home</Link>
          <Link href="/about" className="hover:underline underline-offset-4 focus-visible:underline">About us</Link>
          <Link href="/projects" className="hover:underline underline-offset-4 focus-visible:underline">Project</Link>
          <Link href="/recruit" className="hover:underline underline-offset-4 focus-visible:underline">Recruit</Link>
          <Link href="/contact" className="hover:underline underline-offset-4 focus-visible:underline">Contact</Link>
        </nav>
      </div>
    </header>
  );
}


