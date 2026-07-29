"use client";

import { useEffect } from "react";

/**
 * `.reveal` öğelerine görünür olunca `.is-visible` ekler.
 * MutationObserver ile sonradan eklenen öğeleri de (route değişimi, filtre)
 * otomatik yakalar — aksi hâlde client-side navigasyonda kartlar opacity:0'da
 * takılı kalıyordu ("projeler geç geliyor" bug'ı).
 * Viewport'un ÜSTÜNDE kalan veya zaten görünür bölgedeki öğeler ilk karede
 * açılır; animasyon yalnızca aşağıdan scroll'la girenlere kalır.
 */
export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(".reveal")
        .forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    const attach = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((n) => {
        const r = n.getBoundingClientRect();
        // Sayfa açıldığında zaten görünür/üstte kalanları bekletme
        if (r.top < window.innerHeight * 0.92) n.classList.add("is-visible");
        else io.observe(n);
      });
    };

    attach(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList?.contains("reveal")) attach(node.parentNode ?? document);
            else if (node.querySelector?.(".reveal")) attach(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
