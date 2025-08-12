export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--color-lbd-navy)] text-white py-12" role="contentinfo">
      <div className="container grid md:grid-cols-3 gap-8">
        <div>
          <div className="font-bold">LBD</div>
          <p className="text-white/80 mt-2">Let’s Be Developers</p>
        </div>
        <nav className="grid gap-2" aria-label="푸터 링크">
          <a href="/info" className="hover:underline underline-offset-4">정보</a>
          <a href="/notices" className="hover:underline underline-offset-4">공지</a>
          <a href="/resources" className="hover:underline underline-offset-4">세션 자료</a>
        </nav>
        <div className="md:text-right">
          <p className="text-sm text-white/70">© {new Date().getFullYear()} LBD</p>
        </div>
      </div>
    </footer>
  );
}


