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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
