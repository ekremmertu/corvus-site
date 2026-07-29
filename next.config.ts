import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Kart başlığı → proje detay başlığı morph geçişi (React ViewTransition)
    viewTransition: true,
  },
  async rewrites() {
    return [
      // corvustech.co/terminal → Corvus Tech Terminal (Firebase Hosting'de yaşar).
      // Terminal bundle'ı base '/terminal/' ile build edildiği için asset yolları
      // da bu rewrite üzerinden aynı origin'den akar.
      {
        source: "/terminal",
        destination: "https://corvus-tech.web.app/terminal/",
      },
      {
        source: "/terminal/:path*",
        destination: "https://corvus-tech.web.app/terminal/:path*",
      },
    ];
  },
};

export default nextConfig;
