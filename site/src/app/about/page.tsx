"use client";

import Image from "next/image";

const members = [
  { id: 1, name: "김하늘", role: "리드/백엔드", avatar: "https://picsum.photos/seed/lbd-member-1/160/160" },
  { id: 2, name: "박지우", role: "프론트엔드", avatar: "https://picsum.photos/seed/lbd-member-2/160/160" },
  { id: 3, name: "최도윤", role: "디자이너", avatar: "https://picsum.photos/seed/lbd-member-3/160/160" },
  { id: 4, name: "이서준", role: "PM", avatar: "https://picsum.photos/seed/lbd-member-4/160/160" },
];

export default function AboutPage() {
  return (
    <main className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold">About us</h1>
      <p className="mt-3 text-[color:var(--color-gray-600)] max-w-3xl">
        LBD는 사회문제 해결을 위한 실천 중심의 개발 동아리입니다. 우리는 Learning by Doing을 신념으로 삼아, 
        실제 사용자에게 가치를 주는 제품/서비스를 만들며 성장합니다.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">우리의 미션</h2>
        <ul className="mt-3 list-disc pl-5 text-[color:var(--color-gray-600)]">
          <li>실천을 통해 배우고, 결과로 증명한다</li>
          <li>사회적 임팩트를 만드는 제품을 만든다</li>
          <li>서로의 성장을 돕는 커뮤니티를 지향한다</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">운영진</h2>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
          {members.map((m) => (
            <div key={m.id} className="text-center">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                <Image src={m.avatar} alt={m.name} fill sizes="96px" style={{ objectFit: "cover" }} />
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-sm text-[color:var(--color-gray-600)]">{m.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
