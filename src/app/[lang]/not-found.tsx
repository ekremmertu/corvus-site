"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 404 — dile göre metin (yol /tr ile başlıyorsa Türkçe). */
export default function NotFound() {
  const tr = (usePathname() ?? "").startsWith("/tr");
  const base = tr ? "/tr" : "/en";
  return (
    <section className="nf grain">
      <div className="code" aria-hidden>
        404
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow" style={{ margin: 0 }}>404</p>
        <h1 className="h-display" style={{ margin: "18px 0 0" }}>
          {tr ? "Bu sayfa hiç " : "This page never "}
          <span className="serif sheen">{tr ? "yayına çıkmadı." : "shipped."}</span>
        </h1>
        <p className="lede" style={{ maxWidth: 480, margin: "22px auto 0" }}>
          {tr
            ? "Bağlantı bozuk ya da iş taşındı. Yaptığımız her şey bir tık uzakta."
            : "The link is broken or the work moved. Everything we have built is one click away."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 32 }}>
          <Link href={`${base}/work`} className="pill pill-white">
            {tr ? "İşleri gör" : "See the work"}
          </Link>
          <Link href={base} className="pill pill-line">
            {tr ? "Ana sayfa" : "Home"}
          </Link>
        </div>
      </div>
    </section>
  );
}
