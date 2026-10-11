import type { NextConfig } from "next";

// Tarayıcı tarafı sertleştirme. CSP bilinçli olarak yok: R3F/Next inline script'leri
// ve Higgsfield video kaynakları ayrı bir tur gerektiriyor (TODO.md).
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    // Kart başlığı → proje detay başlığı morph geçişi (React ViewTransition)
    viewTransition: true,
  },
  // /terminal rewrite'ı 2026-07-30'da KALDIRILDI (güvenlik): Terminal iç kullanım
  // aracı, artık yayında değil — sadece local'de `npm run dev` ile çalışır.
  // Geri açılacaksa önce auth eklenmeli, bkz. TODO.md güvenlik turu.
  // TripWalkers EN tanıtım sitesi (Lumière, 12.10.2026): kendi menüsü ve hareket dili olan
  // bağımsız statik sayfa → stüdyo kabuğu (Nav/Footer/imleç) üstüne binmesin diye rewrite.
  // EN + TR (12.10.2026). Bu listeyi değiştirirsen src/components/WorkLink.tsx STANDALONE listesini de güncelle.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/en/work/tripwalkers", destination: "/tripwalkers-site/index.html" },
        { source: "/tr/work/tripwalkers", destination: "/tripwalkers-site/index-tr.html" },
      ],
    };
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
