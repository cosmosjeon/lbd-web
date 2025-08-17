"use client";

export default function ContactPage() {
  return (
    <main className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold">Contact</h1>
      <div className="mt-6 max-w-2xl text-[color:var(--color-gray-600)]">
        <p>운영팀 이메일: contact@lbd.org</p>
        <p className="mt-1">파트너/후원 문의: sponsor@lbd.org</p>
        <p className="mt-1">Slack: lbd-workspace</p>
        <p className="mt-1">Instagram: @lets.be.developers</p>
      </div>
    </main>
  );
}
