import { FeaturedProjects } from "@/app/(marketing)/featured-projects";

export default function Home() {
  return (
    <main id="main">
      <section aria-label="히어로" className="pt-[96px] md:pt-[120px] pb-[80px] bg-[color:var(--color-lbd-teal)] text-white">
        <div className="container grid md:grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">변화를 만드는 개발 커뮤니티, LBD</h1>
            <p className="mt-4 text-base/7 text-white/90">실천과 임팩트를 지향하는 학습과 프로젝트. 지금 우리의 이야기와 작업을 만나보세요.</p>
            <div className="mt-6 flex gap-3">
              <a href="#projects" className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-[color:var(--color-lbd-orange)] text-white transition-transform duration-[var(--duration-ultra-fast)] hover:-translate-y-px active:translate-y-0">프로젝트 보기</a>
              <a href="/subscribe" className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-[color:var(--color-gray-300)] text-[color:var(--color-lbd-navy)] bg-white/0 hover:bg-[color:var(--color-gray-50)]">구독하기</a>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-[var(--radius-card)] bg-white/10" aria-hidden />
        </div>
      </section>

      {/* Supabase 연결 시 표시 */}
      {/* @ts-expect-error Async Server Component */}
      <FeaturedProjects />

      </main>
  );
}
