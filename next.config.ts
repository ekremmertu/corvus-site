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
        { source: "/en/work/blokbom", destination: "/blokbom-site/index.html" },
        { source: "/tr/work/blokbom", destination: "/blokbom-site/index-tr.html" },
        { source: "/en/work/lingoria", destination: "/lingoria-site/index.html" },
        { source: "/tr/work/lingoria", destination: "/lingoria-site/index-tr.html" },
        // Opsiyon Ustası: kişisel eğitim uygulaması. Menüde/sitemap'te yok, noindex; yalnız adresi bilen açar.
        { source: "/tr/opsiyon", destination: "/opsiyon-site/index.html" },
        { source: "/en/opsiyon", destination: "/opsiyon-site/index.html" },
        // ICT Ustası: tek dosyalık bağımsız uygulama (kaynak: ICT Ustalık Yolu/web, içerik Türkçe).
        { source: "/en/ict-ustasi", destination: "/ict-ustasi-site/index.html" },
        { source: "/tr/ict-ustasi", destination: "/ict-ustasi-site/index.html" },
        // Bülten Web (CEO 05.11.2026): Natro sunucusuna vekil. Menüde yok; dış kapı (Caddy) yalnız okuma, POST 403.
        { source: "/bultenv2", destination: "https://bulten.corvus-tech.co/app/" },
        { source: "/bultenv2/api/:path*", destination: "https://bulten.corvus-tech.co/api/:path*" },
        { source: "/bultenv2/panel/:path*", destination: "https://bulten.corvus-tech.co/panel/:path*" },
        { source: "/bultenv2/heimdall-static/:path*", destination: "https://bulten.corvus-tech.co/heimdall-static/:path*" },
        { source: "/bultenv2/:path*", destination: "https://bulten.corvus-tech.co/app/:path*" },
      ],
    };
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Bülten'in Plan ekranı raporu aynı sitede iframe'de açar → yalnız bu yolda DENY yerine SAMEORIGIN
      { source: "/bultenv2/:path*", headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }] },
    ];
  },
};

export default nextConfig;
