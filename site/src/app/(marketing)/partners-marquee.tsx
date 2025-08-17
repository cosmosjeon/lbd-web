"use client";

import Image from "next/image";
import { Marquee } from "@/components/marquee";

const logos = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  src: `https://picsum.photos/seed/lbd-partner-${i + 1}/120/48`,
  alt: `파트너 로고 ${i + 1}`,
}));

export function PartnersMarquee() {
  return (
    <section aria-label="파트너 로고" className="py-12">
      <div className="container">
        <Marquee className="opacity-90">
          {logos.map((l) => (
            <div key={l.id} role="listitem" className="h-12 w-[120px] relative grayscale">
              <Image src={l.src} alt={l.alt} fill sizes="120px" style={{ objectFit: "contain" }} />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}



