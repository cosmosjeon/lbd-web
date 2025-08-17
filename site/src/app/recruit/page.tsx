"use client";

import Link from "next/link";

const notice = {
  cohort: "8th",
  period: "2025.08.20 ~ 2025.09.05",
  activities: ["주 1회 세션(수요일 저녁)", "프로젝트 팀 활동", "중간/최종 공유회"],
  benefit: ["멘토링", "인프라 지원", "프로젝트 전시"],
};

export default function RecruitPage() {
  return (
    <main className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Recruit</h1>
      <section className="mt-6 grid gap-6 md:grid-cols-2 max-w-4xl">
        <div>
          <h2 className="text-xl font-semibold">모집요강 ({notice.cohort})</h2>
          <p className="mt-2 text-[color:var(--color-gray-600)]">접수 기간: {notice.period}</p>
          <h3 className="mt-4 font-semibold">활동</h3>
          <ul className="list-disc pl-5 text-[color:var(--color-gray-600)]">
            {notice.activities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
          <h3 className="mt-4 font-semibold">혜택</h3>
          <ul className="list-disc pl-5 text-[color:var(--color-gray-600)]">
            {notice.benefit.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">지원</h2>
          <div className="mt-3 flex gap-3">
            <Link href="#" className="inline-flex h-10 px-5 rounded-md bg-[color:var(--color-lbd-orange)] text-white items-center justify-center">지원서 작성</Link>
            <Link href="#" className="inline-flex h-10 px-5 rounded-md border border-[color:var(--color-gray-300)] items-center justify-center">합불 조회</Link>
          </div>
          <p className="mt-2 text-xs text-[color:var(--color-gray-600)]">실제 링크는 모집 시작 시 공개됩니다.</p>
        </div>
      </section>
    </main>
  );
}
