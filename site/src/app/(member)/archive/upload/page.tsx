"use client";

import { useState } from "react";
import Papa from "papaparse";
import { sanitize } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";

type Row = Record<string, string>;

export default function ArchiveUploadPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  function onFile(file: File | null) {
    if (!file) return;
    setRows([]);
    setErrors([]);
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const errs: string[] = [];
        const out = (result.data || []).slice(0, 50).map((r, idx) => {
          const sanitized = { ...r };
          if (sanitized.content_html_sanitized) {
            sanitized.content_html_sanitized = sanitize(sanitized.content_html_sanitized);
          }
          if (!sanitized.title) errs.push(`행 ${idx + 1}: title 누락`);
          if (!sanitized.source_url) errs.push(`행 ${idx + 1}: source_url 누락`);
          return sanitized;
        });
        setRows(out);
        setErrors(errs);
      },
      error: (e) => setErrors([e.message]),
    });
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">아카이브 CSV 업로드(시뮬)</h1>
      <p className="mt-2 text-[color:var(--color-gray-600)]">`category_map.csv`, `naver_cafe_posts.csv`에서 발췌한 CSV를 업로드해 미리보기 합니다(최대 50행).</p>
      <div className="mt-4 flex items-center gap-2">
        <input type="file" accept=".csv" onChange={(e) => onFile(e.target.files?.[0] || null)} />
        <Button onClick={() => { setRows([]); setErrors([]); }}>초기화</Button>
      </div>
      {errors.length > 0 && (
        <div className="mt-4 text-[color:var(--color-danger)]">
          {errors.map((e, i) => (<div key={i}>{e}</div>))}
        </div>
      )}
      {rows.length > 0 && (
        <div className="mt-6 overflow-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-[color:var(--color-gray-100)]">
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k} className="px-3 py-2 text-left whitespace-nowrap">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="odd:bg-white even:bg-[color:var(--color-gray-50)]">
                  {Object.values(r).map((v, j) => (
                    <td key={j} className="px-3 py-2 align-top max-w-[320px] whitespace-pre-wrap break-words">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}



