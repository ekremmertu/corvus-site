export type Locale = "en" | "tr";

export type CategorySlug = "ios" | "web" | "fintech" | "ai" | "enterprise";

export type ProjectStatus =
  | "live"
  | "testflight"
  | "beta"
  | "development"
  | "design"
  | "delivered"
  | "internal";

export type L10n = Record<Locale, string>;

export interface Category {
  slug: CategorySlug;
  index: number;
  name: L10n;
  kicker: L10n;
  headline: L10n;
  manifesto: L10n;
  /** Scroll-pinned 3D sahnesinde dönen objenin 4 durağı */
  stops: { title: L10n; body: L10n }[];
  accent: string;
  accentSoft: string;
}

export interface Project {
  slug: string;
  name: string;
  category: CategorySlug;
  status: ProjectStatus;
  year: string;
  stack: string[];
  summary: L10n;
  description: L10n;
  highlights: { en: string[]; tr: string[] };
  metrics?: { label: L10n; value: string }[];
  client?: L10n;
  featured?: boolean;
  /**
   * Yayındaki iOS uygulamasının App Store sayfası.
   * Sadece App Store'da VARLIĞI DOĞRULANMIŞ uygulamalarda doldurulur
   * (iTunes lookup API ile teyit edildi, 2026-07-30).
   */
  appStoreUrl?: string;
  /** Canlı web ürününün adresi (web/fintech kategorileri). */
  liveUrl?: string;
  /** Kart perdelensin mi — bkz. veilOf. Yoksa normal görünür. */
  veil?: Veil;
  /**
   * App Store tanıtım görseli sayısı. Dosyalar `public/appstore/<slug>/1..N.jpg`.
   * iTunes lookup'tan indirilip 640px genişliğe küçültülür (bkz. TODO PASS LOG).
   */
  screenshots?: number;
  /**
   * Projenin ikinci evi. Ameliea hem web platformu hem iOS uygulaması —
   * iki sekmede birden görünür, tek detay sayfası paylaşır.
   */
  alsoIn?: CategorySlug[];
  /**
   * Uygulama henüz App Store'da değil ama yolda.
   * `appStoreUrl` dolduğunda bu alan silinir — ikisi birlikte kullanılmaz.
   */
  appStoreSoon?: boolean;
}

/**
 * Kartin perdelenip perdelenmedigi.
 * TAHMIN YOK — her proje kendi `veil` alanini tasir (CEO listesi, 2026-08-23).
 * - "confidential": musteri isi, adi ve icerigi ASLA gorunmez (NDA)
 * - "soon": henuz yayinda degil
 * - alan yoksa: kart normal gorunur
 */
export type Veil = "soon" | "confidential" | null;

export function veilOf(p: Pick<Project, "veil">): Veil {
  return p.veil ?? null;
}

export const categories: Category[] = [
  {
    slug: "ios",
    index: 0,
    name: { en: "iOS Apps", tr: "iOS Uygulamaları" },
    kicker: { en: "Native. Swift 6. Shipped.", tr: "Native. Swift 6. Yayında." },
    headline: {
      en: "Apps that feel like the phone built them.",
      tr: "Telefonun kendi yapmış gibi hissettiren uygulamalar.",
    },
    manifesto: {
      en: "SwiftUI, @Observable, async/await — no UIKit leftovers, no third-party UI kits. Every app ships through the same pipeline: design system first, then code, then a full QA sweep on the simulator before a build ever reaches TestFlight.",
      tr: "SwiftUI, @Observable, async/await — UIKit artığı yok, hazır UI kit yok. Her uygulama aynı hattan geçer: önce tasarım sistemi, sonra kod, sonra bir build TestFlight'a çıkmadan önce simulator üzerinde uçtan uca QA taraması.",
    },
    stops: [
      {
        title: { en: "Design system first", tr: "Önce tasarım sistemi" },
        body: {
          en: "Tokens, component matrix and motion grammar are locked before the first screen. That is why the fifth screen looks like the first one.",
          tr: "İlk ekrandan önce token, bileşen matrisi ve hareket dili sabitlenir. Beşinci ekranın birinciye benzemesinin sebebi bu.",
        },
      },
      {
        title: { en: "Swift 6 concurrency", tr: "Swift 6 eşzamanlılık" },
        body: {
          en: "Strict concurrency on, warnings treated as bugs. Actors where state is shared, structured concurrency where work is parallel.",
          tr: "Katı eşzamanlılık açık, uyarılar bug sayılır. Paylaşılan state'te actor, paralel işte structured concurrency.",
        },
      },
      {
        title: { en: "QA before TestFlight", tr: "TestFlight'tan önce QA" },
        body: {
          en: "A QA agent maps every user flow and taps through it on the simulator. SplitTable shipped at 95/95 unit + 2/2 UI tests green.",
          tr: "QA ajanı tüm akışları haritalar ve simulator'de gerçek dokunuşlarla gezer. SplitTable 95/95 unit + 2/2 UI testi yeşil çıktı.",
        },
      },
      {
        title: { en: "Store-ready delivery", tr: "Mağazaya hazır teslim" },
        body: {
          en: "Screenshots, privacy nutrition labels, IAP attachment, review submission — the boring half of shipping is automated too.",
          tr: "Ekran görüntüleri, gizlilik etiketleri, IAP bağlama, inceleme gönderimi — yayının sıkıcı yarısı da otomatik.",
        },
      },
    ],
    accent: "#5B8CFF",
    accentSoft: "rgba(91,140,255,0.16)",
  },
  {
    slug: "web",
    index: 1,
    name: { en: "Web Platforms", tr: "Web Platformları" },
    kicker: { en: "Next.js. Supabase. Live payments.", tr: "Next.js. Supabase. Canlı ödeme." },
    headline: {
      en: "Products that take money on day one.",
      tr: "İlk günden para tahsil eden ürünler.",
    },
    manifesto: {
      en: "Not landing pages — platforms with auth, database, payment and an admin surface. One Supabase backbone, one auth system, hardened at the database level so a new product inherits security instead of re-inventing it.",
      tr: "Landing page değil — auth, veritabanı, ödeme ve yönetim yüzeyi olan platformlar. Tek Supabase omurgası, tek auth sistemi, veritabanı seviyesinde sıkılaştırılmış; yeni ürün güvenliği yeniden icat etmek yerine devralıyor.",
    },
    stops: [
      {
        title: { en: "One shared backbone", tr: "Tek ortak omurga" },
        body: {
          en: "Three separate Supabase projects were merged into one ecosystem database with central auth and row-level policies.",
          tr: "Üç ayrı Supabase projesi, merkezi auth ve satır düzeyi politikalarla tek ekosistem veritabanında birleştirildi.",
        },
      },
      {
        title: { en: "Payments that clear", tr: "Gerçekten geçen ödeme" },
        body: {
          en: "iyzico integrated end to end on the wedding invitation platform: checkout, webhook, refund path and coupon logic.",
          tr: "Davetiye platformunda iyzico uçtan uca entegre: ödeme, webhook, iade yolu ve kupon mantığı.",
        },
      },
      {
        title: { en: "Security audited", tr: "Güvenlik denetlendi" },
        body: {
          en: "Three hardening migrations took the ecosystem to zero critical advisor findings, verified at the database level.",
          tr: "Üç sıkılaştırma migration'ı ekosistemi sıfır kritik advisor bulgusuna indirdi, veritabanı seviyesinde doğrulandı.",
        },
      },
      {
        title: { en: "Built to be operated", tr: "İşletilmek için kuruldu" },
        body: {
          en: "Every platform ships with the operator's view: metrics, content tooling and a way to answer a support email without a developer.",
          tr: "Her platform işletenin görünümüyle gelir: metrikler, içerik araçları ve geliştiriciye sormadan destek mailine cevap verme yolu.",
        },
      },
    ],
    accent: "#2DD4BF",
    accentSoft: "rgba(45,212,191,0.16)",
  },
  {
    slug: "fintech",
    index: 2,
    name: { en: "Fintech & Trading", tr: "Fintech & Trading" },
    kicker: { en: "Backtested. Walk-forward. Honest.", tr: "Backtest'li. Walk-forward. Dürüst." },
    headline: {
      en: "Signals we would trade ourselves.",
      tr: "Kendimizin de işleme sokacağı sinyaller.",
    },
    manifesto: {
      en: "Every strategy has to survive walk-forward validation before it is called a system. A lift on a screener is a hypothesis, not an edge — and we say so out loud, including when the numbers disappoint.",
      tr: "Her strateji, sistem denmeden önce walk-forward doğrulamasından geçmek zorunda. Tarayıcıdaki lift bir hipotezdir, edge değil — sayılar hayal kırıklığı olduğunda bunu da açıkça söyleriz.",
    },
    stops: [
      {
        title: { en: "Signal research", tr: "Sinyal araştırması" },
        body: {
          en: "Pattern mining on BTC/ETH: pre-pump sequences, oversold z-scores, leader–follower behaviour across correlated symbols.",
          tr: "BTC/ETH üzerinde pattern madenciliği: pre-pump dizileri, aşırı satım z-skorları, korele semboller arası lider–takipçi davranışı.",
        },
      },
      {
        title: { en: "Walk-forward or nothing", tr: "Walk-forward yoksa yok" },
        body: {
          en: "The 3-symbol leader bot came out 15 of 20 windows positive (75%) with ~23% average drawdown. Reported as it is, not as we wished.",
          tr: "3 sembollü lider botu 20 pencerenin 15'inde pozitif (%75), ortalama %23 düşüş. Dilediğimiz gibi değil, olduğu gibi raporlandı.",
        },
      },
      {
        title: { en: "Market plumbing", tr: "Piyasa tesisatı" },
        body: {
          en: "Pine indicators, screeners and strategies plus a desktop chart automation layer that reads live studies, levels and tables.",
          tr: "Pine gösterge, tarayıcı ve stratejiler; ayrıca canlı gösterge, seviye ve tabloları okuyan masaüstü grafik otomasyon katmanı.",
        },
      },
      {
        title: { en: "Risk is the product", tr: "Ürün, riskin kendisi" },
        body: {
          en: "Position sizing, rebalancing rules and drawdown limits are written before entries. A bot without an exit plan does not go live.",
          tr: "Pozisyon boyutu, rebalance kuralları ve düşüş limitleri girişlerden önce yazılır. Çıkış planı olmayan bot canlıya alınmaz.",
        },
      },
    ],
    accent: "#FFB020",
    accentSoft: "rgba(255,176,32,0.16)",
  },
  {
    slug: "ai",
    index: 3,
    name: { en: "AI Automation", tr: "AI Otomasyon" },
    kicker: { en: "Agents with a job description.", tr: "Görev tanımı olan ajanlar." },
    headline: {
      en: "Agents that produce work, not demos.",
      tr: "Demo değil, iş üreten ajanlar.",
    },
    manifesto: {
      en: "Multi-agent systems with named roles, explicit hand-offs and a deliverable at the end. A council that debates a supply chain decision. A growth engine that writes, renders and schedules. A pipeline that turns a project brief into a shipped app.",
      tr: "İsimli roller, açık devir teslimler ve sonunda somut çıktı olan çok-ajanlı sistemler. Tedarik zinciri kararını tartışan bir meclis. Yazan, render eden ve planlayan bir büyüme motoru. Proje brief'ini yayınlanmış uygulamaya çeviren bir hat.",
    },
    stops: [
      {
        title: { en: "Roles, not prompts", tr: "Prompt değil, rol" },
        body: {
          en: "Eight personas with domain expertise, each with its own evidence standard, arguing until a decision memo exists.",
          tr: "Alan uzmanlığı olan sekiz persona; her birinin kendi kanıt standardı var, bir karar notu çıkana kadar tartışıyorlar.",
        },
      },
      {
        title: { en: "Deterministic where it counts", tr: "Gerektiği yerde deterministik" },
        body: {
          en: "Structural work is code, judgement work is the model. Mixing the two is how agent systems become unreliable.",
          tr: "Yapısal iş kod, yorum işi model. İkisini karıştırmak ajan sistemlerini güvenilmez yapan şeydir.",
        },
      },
      {
        title: { en: "Content that renders itself", tr: "Kendini render eden içerik" },
        body: {
          en: "A growth engine that produces posts, reels and stories end to end — HTML/CSS render pipeline, quality scoring, publishing calendar.",
          tr: "Post, reel ve story'yi uçtan uca üreten büyüme motoru — HTML/CSS render hattı, kalite skoru, yayın takvimi.",
        },
      },
      {
        title: { en: "Measured, then trusted", tr: "Önce ölçüldü, sonra güvenildi" },
        body: {
          en: "Output is scored against real reach numbers, and the diagnosis is allowed to say the bottleneck is distribution, not the machine.",
          tr: "Çıktı gerçek erişim sayılarına göre puanlanır ve teşhis, darboğazın makine değil dağıtım olduğunu söyleyebilir.",
        },
      },
    ],
    accent: "#A855F7",
    accentSoft: "rgba(168,85,247,0.16)",
  },
  {
    slug: "enterprise",
    index: 4,
    name: { en: "Enterprise Tools", tr: "Kurumsal Araçlar" },
    kicker: { en: "Supply chain. Real operations.", tr: "Tedarik zinciri. Gerçek operasyon." },
    headline: {
      en: "Tools built inside the operation.",
      tr: "Operasyonun içinde doğan araçlar.",
    },
    manifesto: {
      en: "Internal tooling for large FMCG operations — route planning around public holidays, distributor reporting, shipment reconciliation from SAP exports. Built by someone who works the process, so the edge cases are in the first version.",
      tr: "Büyük FMCG operasyonları için iç araçlar — resmi tatiller etrafında rut planlama, distribütör raporlaması, SAP çıktılarından sevkiyat mutabakatı. Süreci bizzat işleten biri kurduğu için edge case'ler ilk sürümde var.",
    },
    stops: [
      {
        title: { en: "The process comes first", tr: "Önce süreç" },
        body: {
          en: "Field reality before feature list: which day a route actually moves, what a delivery date means versus a billing date.",
          tr: "Özellik listesinden önce saha gerçeği: bir rut fiilen hangi güne kayar, teslim tarihi ile fatura tarihi neyi ifade eder.",
        },
      },
      {
        title: { en: "Reports that survive audit", tr: "Denetimden geçen raporlar" },
        body: {
          en: "A quota formula error was distorting a distributor revision report by 40 points. Corrected, re-issued, reconciled.",
          tr: "Bir kota formülü hatası distribütör revize raporunu 40 puan saptırıyordu. Düzeltildi, yeniden yayınlandı, mutabık kalındı.",
        },
      },
      {
        title: { en: "Verified against reality", tr: "Gerçeğe karşı doğrulandı" },
        body: {
          en: "A shipment finder reproduced a full month of truck counts from raw exports and matched the approved figure exactly.",
          tr: "Sevkiyat bulucu, ham çıktılardan bir aylık tır sayısını yeniden üretti ve onaylı rakamla birebir tuttu.",
        },
      },
      {
        title: { en: "Confidential by default", tr: "Varsayılan gizlilik" },
        body: {
          en: "Client names, volumes and margins stay out of the portfolio. What is shown is the method and the measured result.",
          tr: "Müşteri isimleri, hacimler ve marjlar portfolyoda yer almaz. Gösterilen şey yöntem ve ölçülmüş sonuçtur.",
        },
      },
    ],
    accent: "#FF6B4A",
    accentSoft: "rgba(255,107,74,0.16)",
  },
];


export const statusLabels: Record<ProjectStatus, L10n> = {
  live: { en: "Live", tr: "Yayında" },
  testflight: { en: "TestFlight", tr: "TestFlight" },
  beta: { en: "Beta", tr: "Beta" },
  development: { en: "In development", tr: "Geliştirmede" },
  design: { en: "Design phase", tr: "Tasarım fazı" },
  delivered: { en: "Delivered", tr: "Teslim edildi" },
  internal: { en: "Internal", tr: "Dahili" },
};

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug)!;
}

/**
 * Karta basilabilecek GUVENLI veri.
 * Perdeli projede `name` / `summary` / `metrics` YOKTUR — boylece gizli metin
 * ne HTML'e ne de istemci JS paketine girer. Blur yalnizca gorsel katmandir.
 */
export type CardProject = {
  slug: string;
  /** Kart sırası — küçük olan üstte. Bkz. rankOf. */
  rank: number;
  /** İkinci kategoriye açılmış kopya. "Tümü" sekmesinde sayılmaz. */
  dup?: boolean;
  category: CategorySlug;
  status: ProjectStatus;
  stack: string[];
  veil: Veil;
  name?: string;
  summary?: L10n;
  appStoreSoon?: boolean;
  metrics?: { label: L10n; value: string }[];
};
