import type { Dict } from "@/i18n/dict";

/**
 * SSS — native <details> (klavye/ekran okuyucu bedava).
 * FAQPage yapısal verisi aynı kaynaktan üretilir (görünen içerikle birebir).
 */
export default function Faq({ d }: { d: Dict }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <h2 id="faq-title" className="h-section reveal" style={{ margin: 0 }}>
          {d.home.faqTitle}
        </h2>
        <div className="faq-list reveal">
          {d.faq.items.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>
                <span>{f.q}</span>
                <span className="plus" aria-hidden>
                  +
                </span>
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
