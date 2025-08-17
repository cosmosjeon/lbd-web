"use client";

import Image from "next/image";
import { FeaturedProjects } from "@/app/(marketing)/featured-projects";
import { PartnersMarquee } from "@/app/(marketing)/partners-marquee";

function SlidingCopy() {
  const phrase = "Learning by Doing, Creating for Impact";
  return (
    <div className="container text-center">
      <div className="inline-block align-middle">
        <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white/90">
          <span className="text-[color:var(--color-lbd-orange)]">L</span>
          earning by <span className="text-[color:var(--color-lbd-orange)]">B</span>
          y <span className="text-[color:var(--color-lbd-orange)]">D</span>
          oing, Creating for <span className="text-[color:var(--color-lbd-orange)]">Impact</span>
        </p>
        <span className="sr-only">{phrase}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main">
      {/* Hero */}
      <section aria-label="히어로" className="relative min-h-[110svh] text-white">
        {/* Background image */}
        <Image
          src="/first-hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        {/* Dark overlay + bottom gradient for legibility */}
        <div className="absolute inset-0 bg-black/35" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />

        {/* Content */}
        <div className="relative z-[1]">
          <div className="container min-h-[110svh] pt-[210px] pb-12 flex items-center justify-center">
            <div className="max-w-[1040px] text-center">
              <h1 className="tracking-tight">
                <span className="block mt-3 text-[3.25rem] sm:text-[3.25rem] md:text-[3.25rem] font-semibold text-white/90">사회문제 해결 창업 동아리</span>
              </h1>
              <div className="mt-6 leading-[0.9]">
                <div className="text-[56px] sm:text-[88px] md:text-[120px] font-extrabold text-[#bfe5e5]">Learning By</div>
                <div className="mt-[-8px] text-[56px] sm:text-[88px] md:text-[120px] font-extrabold text-[#bfe5e5]/90">Doing</div>
              </div>
              <a
                href="/subscribe"
                className="mt-10 inline-flex items-center justify-center h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20"
              >
                모집 알림 신청하기
                <span aria-hidden className="ml-2">›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sliding Text Section */}
      <section aria-label="슬라이딩 카피" className="py-[80px] min-h-[600px] flex items-center relative">
        <div className="pointer-events-none absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-[color:var(--background)]" aria-hidden />
        <SlidingCopy />
      </section>

      {/* Supabase 연결 시 표시 */}
      <FeaturedProjects />

      <PartnersMarquee />

    </main>
  );
}
