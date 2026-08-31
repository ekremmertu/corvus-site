import type { Dict } from "@/i18n/dict";

/**
 * Native <details> — keyboard support, screen reader semantics and
 * find-in-page all come for free. The oversized title is the Ciao-style
 * moment; the interaction underneath stays boring on purpose.
 */
export default function Faq({ d }: { d: Dict }) {
  /**
   * GEO — FAQPage yapısal verisi.
   *
   * "Corvus Tech ne yapıyor?" / "fikirden App Store'a götürüyor musunuz?" gibi
   * sorular artık yapay zekâ asistanlarına soruluyor. Bu blok motorun cevabı
   * sayfadan TAHMİN etmek yerine bizden OKUMASINI sağlar.
   *
   * ⚖️ Sorular `d.faq.items`'tan gelir — yani AŞAĞIDA GÖRÜNEN akordeonun ta
   *    kendisi. schema.org, işaretlemenin sayfada görünen içerikle aynı olmasını
   *    şart koşar; tek kaynaktan beslemek bunu yapısal olarak garanti eder.
   *    Sayfa iki dilde üretildiği için her dil kendi FAQPage'ini alır.
   */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-[color:var(--c-bg)]/86"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto w-full max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <h2 id="faq-title" className="display" style={{ fontSize: "var(--type-mega)" }}>
          <span className="block">{d.faq.title1}</span>
          <span
            className="display-italic block"
            style={{
              WebkitTextStroke: "1px var(--c-live)",
              color: "transparent",
            }}
          >
            {d.faq.title2}
          </span>
        </h2>

        <div className="mt-14 border-t border-[color:var(--c-border)]">
          {d.faq.items.map((item) => (
            <details
              key={item.q}
              className="group border-b border-[color:var(--c-border)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-[color:var(--c-live)] [&::-webkit-details-marker]:hidden">
                <span className="text-[clamp(1rem,1.5vw,1.25rem)] font-medium">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--c-border)] text-dim transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="lede max-w-[76ch] pb-7 pr-12 text-[15px]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
