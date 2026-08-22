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

export const projects: Project[] = [
  // ─────────────────────────────  iOS  ─────────────────────────────
  {
    slug: "tripwalkers",
    name: "TripWalkers",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "Supabase", "StoreKit 2", "AI itinerary"],
    featured: true,
    appStoreUrl: "https://apps.apple.com/tr/app/tripwalkers/id6764424121",
    summary: {
      en: "AI travel planner that turns a city and three free days into an hour-by-hour itinerary.",
      tr: "Bir şehri ve üç boş günü saat saat gezi planına çeviren AI seyahat planlayıcı.",
    },
    description: {
      en: "Live on the App Store. You pick a destination, a pace and the things you actually care about; the app writes a day-by-day plan, keeps it editable offline and lets a group travel off the same plan. Free tier plus two in-app purchase tiers.",
      tr: "App Store'da yayında. Bir rota, bir tempo ve gerçekten önemsediğin şeyleri seçiyorsun; uygulama günlük planı yazıyor, çevrimdışı düzenlenebilir tutuyor ve bir grubun aynı plan üzerinden gezmesini sağlıyor. Ücretsiz katman ve iki uygulama içi satın alma seviyesi.",
    },
    highlights: {
      en: [
        "Shipped to the App Store and maintained through v1.2.5",
        "Group travel: shared plans with live edits and roles",
        "Free + $4.99 / $9.99 in-app purchase tiers via StoreKit 2",
      ],
      tr: [
        "App Store'a çıkarıldı ve v1.2.5'e kadar sürdürüldü",
        "Grup gezisi: canlı düzenleme ve rollerle paylaşılan planlar",
        "StoreKit 2 ile ücretsiz + $4.99 / $9.99 satın alma katmanları",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
      { label: { en: "Version", tr: "Sürüm" }, value: "v1.2.5" },
      { label: { en: "Model", tr: "Model" }, value: "Free + IAP" },
    ],
  },
  {
    slug: "quill",
    name: "Quill",
    category: "ios",
    status: "testflight",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "SwiftData", "TestFlight"],
    featured: true,
    summary: {
      en: "Personal finance app built around debt payoff strategy, not budget guilt.",
      tr: "Bütçe suçluluğu değil, borç kapatma stratejisi üzerine kurulmuş kişisel finans uygulaması.",
    },
    description: {
      en: "Quill models your debts and goals, then orders them with avalanche or snowball logic and shows what one extra payment actually changes. Currently on TestFlight at build 16, signed and delivered through an automated archive → export → upload pipeline.",
      tr: "Quill borçlarını ve hedeflerini modelliyor, çığ veya kartopu mantığıyla sıralıyor ve tek bir ek ödemenin neyi değiştirdiğini gösteriyor. Şu an TestFlight'ta build 16; otomatik archive → export → yükleme hattıyla imzalanıp teslim ediliyor.",
    },
    highlights: {
      en: [
        "Debt strategy engine with payoff ordering and extra-payment simulation",
        "Goals and expense tracking on one SwiftData model layer",
        "Automated signing and TestFlight delivery pipeline",
      ],
      tr: [
        "Ödeme sıralaması ve ek-ödeme simülasyonu olan borç stratejisi motoru",
        "Tek SwiftData model katmanında hedef ve gider takibi",
        "Otomatik imzalama ve TestFlight teslim hattı",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "TestFlight" },
      { label: { en: "Build", tr: "Build" }, value: "16" },
    ],
  },
  {
    slug: "splittable",
    name: "SplitTable",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["SwiftUI", "Supabase", "iPad", "XCTest"],
    featured: true,
    summary: {
      en: "Restaurant table app: split the bill, then show the owner what the data means.",
      tr: "Restoran masa uygulaması: hesabı böl, sonra işletmeciye verinin ne anlattığını göster.",
    },
    description: {
      en: "Two products in one codebase — a guest side that splits a table bill without arguments, and a manager side with operational analytics: table turnover, menu performance and the numbers that make the pitch to a restaurant.",
      tr: "Tek kod tabanında iki ürün — masadaki hesabı tartışmadan bölen misafir tarafı ve operasyonel analitiği olan yönetici tarafı: masa devir hızı, menü performansı ve restoranı ikna eden sayılar.",
    },
    highlights: {
      en: [
        "95/95 unit tests and 2/2 UI tests green, two shipping targets",
        "Manager analytics layer built from the restaurant's own objections",
        "iPad-native layout, not a stretched phone screen",
      ],
      tr: [
        "95/95 unit ve 2/2 UI testi yeşil, iki ayrı target",
        "Restoranın kendi itirazlarından doğan yönetici analitiği katmanı",
        "Esnetilmiş telefon ekranı değil, iPad-native düzen",
      ],
    },
    metrics: [
      { label: { en: "Tests", tr: "Test" }, value: "97/97" },
      { label: { en: "Targets", tr: "Target" }, value: "2" },
    ],
  },
  {
    slug: "nobetgo",
    name: "NöbetGO",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["SwiftUI", "MapKit", "XCUITest"],
    summary: {
      en: "Finds the pharmacy that is actually open tonight, in every province of Turkey.",
      tr: "Türkiye'nin her ilinde bu gece gerçekten açık olan eczaneyi bulur.",
    },
    description: {
      en: "A small app with a hard requirement: be right. Duty pharmacy data per province, distance sorting, one-tap directions and a UI that works at 3am with one hand. Produced end to end through the internal product pipeline and validated with XCUITest.",
      tr: "Küçük ama zor bir şartı olan uygulama: doğru olmak. İl bazlı nöbetçi eczane verisi, mesafeye göre sıralama, tek dokunuşla yol tarifi ve gece 3'te tek elle çalışan arayüz. İç ürün hattından uçtan uca üretildi ve XCUITest ile doğrulandı.",
    },
    highlights: {
      en: [
        "Province-level duty pharmacy coverage with distance sorting",
        "Generated through the internal product pipeline, validated automatically",
        "XCUITest 3/3 passing on the shipped build",
      ],
      tr: [
        "Mesafeye göre sıralamalı, il düzeyinde nöbetçi eczane kapsamı",
        "İç ürün hattından üretildi, otomatik doğrulandı",
        "Teslim edilen build'de XCUITest 3/3 geçti",
      ],
    },
  },
  {
    slug: "twinears",
    name: "TwinEars",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["MultipeerConnectivity", "MTAudioProcessingTap", "Broadcast Extension"],
    summary: {
      en: "Two phones, two pairs of headphones, one synchronised soundtrack.",
      tr: "İki telefon, iki kulaklık, tek senkron ses.",
    },
    description: {
      en: "The hard part is not sharing audio, it is keeping two devices in sync without a server. TwinEars taps the system audio stream through a broadcast extension and distributes it peer to peer over MultipeerConnectivity with drift correction.",
      tr: "Zor kısım sesi paylaşmak değil, sunucu olmadan iki cihazı senkron tutmak. TwinEars sistem sesini broadcast extension üzerinden yakalıyor ve MultipeerConnectivity ile eşler arası dağıtıyor, kayma düzeltmesiyle.",
    },
    highlights: {
      en: [
        "System-wide audio capture via a Broadcast Upload Extension",
        "Serverless peer-to-peer distribution with drift correction",
        "Clean build across two targets, zero warnings",
      ],
      tr: [
        "Broadcast Upload Extension ile sistem geneli ses yakalama",
        "Sunucusuz eşler arası dağıtım ve kayma düzeltmesi",
        "İki target'ta temiz build, sıfır uyarı",
      ],
    },
  },
  {
    slug: "moto-asistan",
    name: "Moto Asistan",
    category: "ios",
    status: "design",
    year: "2026",
    stack: ["SwiftUI", "3D model viewer", "AI diagnostics"],
    summary: {
      en: "An AI mechanic for Turkish motorcycle riders — plus your bike in stylised 3D.",
      tr: "Türk motosikletçileri için AI usta — ve motorunun stilize 3D hali.",
    },
    description: {
      en: "Pick your model from a 20–30 bike library, inspect it in 3D, turn rides into stories and ask a mechanic-grade assistant about a noise, a warning light or a service interval. Freemium, design phase complete.",
      tr: "20–30 modellik kütüphaneden motorunu seç, 3D incele, sürüşlerini hikâyeye çevir ve bir sese, uyarı lambasına ya da bakım aralığına dair usta seviyesinde asistana sor. Freemium, tasarım fazı tamamlandı.",
    },
    highlights: {
      en: [
        "20–30 model library with stylised 3D inspection",
        "Diagnostic assistant tuned to Turkish rider vocabulary",
        "Ride log that becomes shareable stories",
      ],
      tr: [
        "Stilize 3D incelemeli 20–30 modellik kütüphane",
        "Türk sürücü diline göre ayarlanmış teşhis asistanı",
        "Paylaşılabilir hikâyeye dönüşen sürüş günlüğü",
      ],
    },
  },
  {
    slug: "dermia",
    name: "Dermia",
    category: "ios",
    status: "design",
    year: "2026",
    stack: ["SwiftUI", "Vision", "Barcode", "AI assistant"],
    summary: {
      en: "Scan anything on a pharmacy shelf and get an explanation, not a sales pitch.",
      tr: "Eczane rafındaki her ürünü tara, satış konuşması değil açıklama al.",
    },
    description: {
      en: "Medication, supplement and dermocosmetic knowledge in one assistant that knows your profile. Deliberately not a marketplace: it explains interactions, ingredients and whether you need the product at all.",
      tr: "İlaç, takviye ve dermokozmetik bilgisi, profilini bilen tek bir asistanda. Bilinçli olarak pazar yeri değil: etkileşimleri, içerikleri ve o ürüne gerçekten ihtiyacın olup olmadığını anlatıyor.",
    },
    highlights: {
      en: [
        "Photo and barcode capture on the shelf",
        "Unified medication + supplement + dermocosmetic knowledge",
        "No marketplace, no commission bias",
      ],
      tr: [
        "Rafta fotoğraf ve barkod ile yakalama",
        "Birleşik ilaç + takviye + dermokozmetik bilgisi",
        "Pazar yeri yok, komisyon yanlılığı yok",
      ],
    },
  },
  {
    slug: "gece-senin",
    name: "Gece Senin",
    category: "ios",
    status: "design",
    year: "2026",
    stack: ["SwiftUI", "HealthKit", "Audio"],
    summary: {
      en: "A judgement-free 15-minute wind-down for mothers at the end of a long night.",
      tr: "Uzun bir gecenin sonunda anneler için yargısız 15 dakikalık yavaşlama.",
    },
    description: {
      en: "Built for the hour when everyone else is asleep. A short wind-down flow, a sleep hand-off ritual and content that never tells a tired parent what she should have done differently.",
      tr: "Herkesin uyuduğu saat için kuruldu. Kısa bir yavaşlama akışı, uyku devri ritüeli ve yorgun bir anneye neyi yanlış yaptığını asla söylemeyen içerik.",
    },
    highlights: {
      en: [
        "15-minute wind-down flow designed for late-night use",
        "Sleep hand-off ritual between partners",
        "Tone guide written to remove judgement from every string",
      ],
      tr: [
        "Gece geç saat için tasarlanmış 15 dakikalık akış",
        "Partnerler arası uyku devri ritüeli",
        "Her metinden yargıyı silmek için yazılmış ton rehberi",
      ],
    },
  },
  {
    slug: "beanyone",
    name: "BeAnyone",
    category: "ios",
    status: "development",
    year: "2026",
    stack: ["SwiftUI", "Swift 6 actors", "Generative AI", "PostHog"],
    summary: {
      en: "Create a character, give it a soul, watch the generation ritual play out.",
      tr: "Bir karakter yarat, ruh ver, üretim ritüelini izle.",
    },
    description: {
      en: "An AI character studio where generation is staged as a four-act ritual instead of a spinner. Eleven specced screens, a quota actor for safe concurrent writes, and a two-layer observability setup separating product funnel from operational crashes.",
      tr: "Üretimin spinner yerine dört perdelik ritüel olarak sahnelendiği bir AI karakter stüdyosu. On bir ekran spec'i, güvenli eşzamanlı yazım için kota actor'ü ve ürün funnel'ını operasyonel çökmelerden ayıran iki katmanlı gözlemlenebilirlik.",
    },
    highlights: {
      en: [
        "Four-stage generation state machine instead of a loading spinner",
        "Swift 6 actor-based quota tracking",
        "Split analytics: product funnel vs operational alerting",
      ],
      tr: [
        "Yükleme spinner'ı yerine dört aşamalı üretim state machine'i",
        "Swift 6 actor tabanlı kota takibi",
        "Ayrık analitik: ürün funnel'ı ve operasyonel alarm",
      ],
    },
  },
  {
    slug: "society-food",
    name: "Society Food",
    category: "ios",
    status: "development",
    year: "2026",
    stack: ["SwiftUI", "MapKit", "Supabase"],
    summary: {
      en: "Your friend group's shared memory of every place you ate and every place you meant to.",
      tr: "Arkadaş grubunun yediği ve gitmeyi planladığı her mekânın ortak hafızası.",
    },
    description: {
      en: "Group-first, not review-first. Lists live inside a group, the map is shared, and the checklist of \"we said we would go here\" finally has an owner.",
      tr: "Yorum değil, grup merkezli. Listeler grubun içinde yaşıyor, harita ortak ve \"buraya gideceğiz demiştik\" listesinin sonunda bir sahibi var.",
    },
    highlights: {
      en: [
        "Groups as the primary object, not user profiles",
        "Shared map with per-group checklists",
        "Share sheet that works for people outside the app",
      ],
      tr: [
        "Birincil nesne kullanıcı profili değil, grup",
        "Grup başına checklist'li ortak harita",
        "Uygulama dışındakiler için de çalışan paylaşım akışı",
      ],
    },
  },
  {
    slug: "corvus-budget",
    name: "Corvus Budget",
    category: "ios",
    status: "live",
    year: "2025",
    stack: ["SwiftUI", "StoreKit", "App Store"],
    summary: {
      en: "The first Corvus app on the App Store — household budgeting without spreadsheets.",
      tr: "App Store'daki ilk Corvus uygulaması — tablo dosyasız ev bütçesi.",
    },
    description: {
      en: "Where the studio's iOS pipeline was first proven: design system, StoreKit setup, privacy labels, review submission and post-launch maintenance on a live, publicly downloadable app.",
      tr: "Stüdyonun iOS hattının ilk kanıtlandığı yer: tasarım sistemi, StoreKit kurulumu, gizlilik etiketleri, inceleme gönderimi ve canlı, herkese açık bir uygulamada yayın sonrası bakım.",
    },
    highlights: {
      en: [
        "Published on the App Store under the Corvus Tech developer account",
        "Full submission pipeline proven end to end",
        "Foundation for every iOS product that followed",
      ],
      tr: [
        "Corvus Tech geliştirici hesabı altında App Store'da yayında",
        "Uçtan uca kanıtlanmış tam gönderim hattı",
        "Sonraki her iOS ürününün temeli",
      ],
    },
  },

  // ─────────────────────────────  WEB  ─────────────────────────────
  {
    slug: "amelie-co",
    name: "Amelie.co",
    category: "web",
    status: "live",
    year: "2026",
    stack: ["Next.js", "Supabase", "iyzico", "Theme engine"],
    featured: true,
    summary: {
      en: "Digital wedding invitations that feel like a film, sold and paid for online.",
      tr: "Film gibi hissettiren, online satılan ve ödemesi alınan dijital düğün davetiyeleri.",
    },
    description: {
      en: "A live platform with a theme library, a couple-facing editor, RSVP collection and real card payments through iyzico. Each theme is art-directed for a specific bride persona rather than being a colour swap of the last one.",
      tr: "Tema kütüphanesi, çiftler için editör, RSVP toplama ve iyzico üzerinden gerçek kart ödemesi olan canlı bir platform. Her tema, bir öncekinin renk varyantı olmak yerine belirli bir gelin personası için sanat yönetimiyle kurgulanıyor.",
    },
    highlights: {
      en: [
        "Live payments via iyzico, including coupon and refund paths",
        "Theme library with per-theme art direction and cinematic promos",
        "Companion iOS app in TestFlight on the same Supabase backend",
      ],
      tr: [
        "iyzico ile canlı ödeme; kupon ve iade yolları dâhil",
        "Tema başına sanat yönetimi ve sinematik tanıtımlar",
        "Aynı Supabase arkasında TestFlight'ta eşlik eden iOS uygulaması",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "Live" },
      { label: { en: "Payments", tr: "Ödeme" }, value: "iyzico" },
    ],
  },
  {
    slug: "supply-chain-council",
    name: "Supply Chain Council",
    category: "web",
    status: "beta",
    year: "2026",
    stack: ["Next.js", "FastAPI", "Multi-agent", "Claude"],
    featured: true,
    summary: {
      en: "Eight AI experts argue your supply chain decision until a memo exists.",
      tr: "Sekiz AI uzmanı, bir karar notu çıkana kadar tedarik zinciri kararını tartışıyor.",
    },
    description: {
      en: "Upload a case — a disruption, an improvement idea, a post-mortem — and a council of eight domain personas debates it in rounds, challenges each other's evidence and produces a decision document with dissenting opinions attached.",
      tr: "Bir vaka yükle — kesinti, iyileştirme fikri ya da forensic inceleme — sekiz alan personasından oluşan meclis turlar hâlinde tartışsın, birbirinin kanıtını sorgulasın ve karşı görüşleri de ekli bir karar dokümanı üretsin.",
    },
    highlights: {
      en: [
        "Eight expert personas with independent evidence standards",
        "Three case types: action, improvement and forensic",
        "80+ term glossary so the output reads like a real memo",
      ],
      tr: [
        "Bağımsız kanıt standardı olan sekiz uzman persona",
        "Üç vaka tipi: aksiyon, iyileştirme ve forensic",
        "Çıktının gerçek bir not gibi okunması için 80+ terimlik sözlük",
      ],
    },
    metrics: [
      { label: { en: "Agents", tr: "Ajan" }, value: "8" },
      { label: { en: "Case types", tr: "Vaka tipi" }, value: "3" },
    ],
  },
  {
    slug: "cvtoapply",
    name: "CVtoapply",
    category: "web",
    status: "development",
    year: "2026",
    stack: ["Next.js", "FastAPI", "Anthropic API"],
    summary: {
      en: "Rewrites your CV for the specific job posting, ATS-readable on the first pass.",
      tr: "CV'ni ilana göre yeniden yazar, ilk okumada ATS-uyumlu.",
    },
    description: {
      en: "Paste a job ad, upload any CV layout — sidebar, two-column, designed — and the parser reads it structurally instead of guessing. Then a two-panel editor shows what is missing before it produces the ATS-optimised version.",
      tr: "İlanı yapıştır, hangi düzende olursa olsun CV'ni yükle — kenar çubuklu, çok sütunlu, tasarımlı — parser tahmin etmek yerine yapısal okusun. Sonra iki panelli editör, ATS-optimize sürümü üretmeden önce eksikleri gösteriyor.",
    },
    highlights: {
      en: [
        "Structural CV parsing that survives designed layouts",
        "Two-phase flow: show gaps first, rewrite second",
        "Hybrid architecture — deterministic structure, model-driven language",
      ],
      tr: [
        "Tasarımlı düzenlerde de bozulmayan yapısal CV ayrıştırma",
        "İki fazlı akış: önce eksikleri göster, sonra yeniden yaz",
        "Hibrit mimari — yapı deterministik, dil model tarafında",
      ],
    },
  },
  {
    slug: "musteri-bul",
    name: "Müşteri Bul",
    category: "web",
    status: "development",
    year: "2026",
    stack: ["Next.js", "Supabase", "Lead scoring"],
    summary: {
      en: "AI lead finding for freelancers and small agencies who hate cold lists.",
      tr: "Soğuk listelerden nefret eden freelancer ve küçük ajanslar için AI müşteri bulma.",
    },
    description: {
      en: "Describe the client you want, and the platform assembles and scores a target list with the reason each company is a fit — so outreach starts from a hypothesis instead of a spreadsheet.",
      tr: "İstediğin müşteriyi tarif et; platform hedef listeyi toplasın, puanlasın ve her şirketin neden uygun olduğunu yazsın — böylece iletişim bir tablodan değil, bir hipotezden başlasın.",
    },
    highlights: {
      en: [
        "Scored target lists with a stated reason per lead",
        "Built on the shared ecosystem auth and database",
        "Subscription product with a defined MRR path",
      ],
      tr: [
        "Her aday için gerekçesi yazılı, puanlanmış hedef listeler",
        "Ortak ekosistem auth ve veritabanı üzerine kurulu",
        "Tanımlı MRR yolu olan abonelik ürünü",
      ],
    },
  },
  {
    slug: "anaokulu-radar",
    name: "Preschool Location Radar",
    category: "web",
    status: "delivered",
    year: "2026",
    stack: ["Data analysis", "Interactive maps", "Investor reporting"],
    summary: {
      en: "Where to open a preschool: a 15 km catchment study answered with a map, not an opinion.",
      tr: "Anaokulu nereye açılır: 15 km'lik etki alanı çalışması, görüşle değil haritayla cevaplandı.",
    },
    description: {
      en: "A location decision turned into evidence — demographic layers, competitor density and access corridors across a 15 km radius, delivered as an interactive map plus an investor-ready report that ranks the corridors.",
      tr: "Bir lokasyon kararı kanıta çevrildi — 15 km yarıçapta demografik katmanlar, rakip yoğunluğu ve ulaşım koridorları; koridorları sıralayan yatırımcıya hazır rapor ve interaktif haritayla teslim edildi.",
    },
    highlights: {
      en: [
        "15 km catchment analysis with ranked corridors",
        "Interactive map deliverable, not a static deck",
        "Investor-facing report generated from the same dataset",
      ],
      tr: [
        "Koridorları sıralanmış 15 km etki alanı analizi",
        "Statik sunum değil, interaktif harita teslimi",
        "Aynı veri setinden üretilen yatırımcı raporu",
      ],
    },
  },
  {
    slug: "company-os",
    name: "Corvus Company OS",
    category: "web",
    status: "internal",
    year: "2026",
    stack: ["Pipeline orchestration", "Design tooling", "Multi-agent"],
    summary: {
      en: "The internal machine that takes a product idea from brief to shipped build.",
      tr: "Bir ürün fikrini brief'ten yayınlanmış build'e taşıyan iç makine.",
    },
    description: {
      en: "Not a customer product — the studio's own operating system. Discovery, design, build and validation stages with tracked artefacts, so a small team can run more products than its headcount suggests.",
      tr: "Müşteri ürünü değil — stüdyonun kendi işletim sistemi. İzlenen çıktılarla keşif, tasarım, geliştirme ve doğrulama aşamaları; böylece küçük bir ekip, kişi sayısının imâ ettiğinden fazla ürünü yürütebiliyor.",
    },
    highlights: {
      en: [
        "Brief → discovery → design → build → validate, with artefacts at each gate",
        "Design tooling integration for high-fidelity screens",
        "Produced shipping apps, including the duty-pharmacy finder",
      ],
      tr: [
        "Brief → keşif → tasarım → geliştirme → doğrulama, her kapıda çıktıyla",
        "Yüksek sadakatli ekranlar için tasarım aracı entegrasyonu",
        "Nöbetçi eczane bulucu dâhil yayınlanan uygulamalar üretti",
      ],
    },
  },

  // ───────────────────────────  FINTECH  ───────────────────────────
  {
    slug: "heimdall",
    name: "Heimdall Radar",
    category: "fintech",
    status: "development",
    year: "2026",
    stack: ["Pine Script", "Screener", "Signal engine"],
    featured: true,
    summary: {
      en: "A signal radar watching 600 Istanbul-listed equities for one setup at a time.",
      tr: "600 BIST hissesini tek bir kurulum için tarayan sinyal radarı.",
    },
    description: {
      en: "Indicator, screener and strategy written as one family so the chart, the scan and the backtest agree with each other. Built to answer a single question every morning: which symbols changed state overnight?",
      tr: "Gösterge, tarayıcı ve strateji tek aile olarak yazıldı; böylece grafik, tarama ve backtest birbiriyle tutarlı. Her sabah tek bir soruyu cevaplamak için kuruldu: hangi semboller gece durum değiştirdi?",
    },
    highlights: {
      en: [
        "Indicator + screener + strategy sharing one rule set",
        "Covers ~600 symbols in a single scan",
        "Designed around a broker bridge for execution",
      ],
      tr: [
        "Tek kural setini paylaşan gösterge + tarayıcı + strateji",
        "Tek taramada ~600 sembol kapsamı",
        "Emir iletimi için aracı köprüsü etrafında tasarlandı",
      ],
    },
  },
  {
    slug: "livecryptobot",
    name: "LiveCryptoBot",
    category: "fintech",
    status: "beta",
    year: "2026",
    stack: ["Python", "Walk-forward", "Exchange API"],
    featured: true,
    summary: {
      en: "A three-symbol crypto bot that trades the leader and reports its drawdowns honestly.",
      tr: "Lideri işleyen ve düşüşlerini dürüstçe raporlayan üç sembollü kripto botu.",
    },
    description: {
      en: "Leader–follower logic across three correlated symbols, validated with walk-forward windows rather than a single flattering backtest. Fifteen of twenty windows came out positive; the average drawdown is published next to the wins.",
      tr: "Üç korele sembol arasında lider–takipçi mantığı; tek bir gurur okşayıcı backtest yerine walk-forward pencereleriyle doğrulandı. Yirmi pencerenin on beşi pozitif çıktı; ortalama düşüş, kazançların yanında yayınlanıyor.",
    },
    highlights: {
      en: [
        "15/20 walk-forward windows positive (75%)",
        "Monthly 10R capture recorded in validation",
        "~23% average drawdown reported alongside returns",
      ],
      tr: [
        "20 walk-forward penceresinin 15'i pozitif (%75)",
        "Doğrulamada aylık 10R yakalandı",
        "Getirilerin yanında ~%23 ortalama düşüş raporlandı",
      ],
    },
    metrics: [
      { label: { en: "Positive windows", tr: "Pozitif pencere" }, value: "15/20" },
      { label: { en: "Avg drawdown", tr: "Ort. düşüş" }, value: "~23%" },
    ],
  },
  {
    slug: "radarcrypto",
    name: "RadarCrypto",
    category: "fintech",
    status: "development",
    year: "2026",
    stack: ["Python", "Pattern mining", "Backtest"],
    summary: {
      en: "Pattern research on BTC and ETH, including the patterns that did not hold up.",
      tr: "BTC ve ETH üzerinde pattern araştırması — tutmayan pattern'ler dâhil.",
    },
    description: {
      en: "Pre-pump sequence detection and oversold z-score studies, run through a discipline that separates a screener lift from a tradable edge. Findings that failed walk-forward are documented as failures.",
      tr: "Pre-pump dizisi tespiti ve aşırı satım z-skoru çalışmaları; tarayıcı lift'ini işleme dönüştürülebilir edge'den ayıran bir disiplinle koşuluyor. Walk-forward'da düşen bulgular başarısızlık olarak belgeleniyor.",
    },
    highlights: {
      en: [
        "Pre-pump sequence research on major pairs",
        "Explicit separation of screener lift and backtested edge",
        "Negative results kept in the record",
      ],
      tr: [
        "Ana paritelerde pre-pump dizisi araştırması",
        "Tarayıcı lift'i ile backtest edge'inin açık ayrımı",
        "Negatif sonuçlar kayıtta tutuluyor",
      ],
    },
  },
  {
    slug: "takim-kur",
    name: "Systematic Portfolio",
    category: "fintech",
    status: "development",
    year: "2026",
    stack: ["Portfolio rules", "Rebalancing", "Risk limits"],
    summary: {
      en: "A rules-based portfolio where rebalancing is mandatory, not optional.",
      tr: "Rebalance'ın opsiyonel değil zorunlu olduğu, kurallı bir portföy.",
    },
    description: {
      en: "Capital allocation across Turkish equities and crypto with a passive international sleeve, written as rules a person can follow on a bad week. Nothing goes live before the backtest evidence does.",
      tr: "BIST ve kripto ağırlıklı, pasif uluslararası bacağı olan sermaye dağılımı; kötü bir haftada insanın uygulayabileceği kurallar hâlinde yazıldı. Backtest kanıtı çıkmadan hiçbir şey canlıya alınmıyor.",
    },
    highlights: {
      en: [
        "Explicit allocation and rebalancing rules",
        "Risk limits written before entries",
        "Live deployment gated on backtest evidence",
      ],
      tr: [
        "Açık dağılım ve rebalance kuralları",
        "Girişlerden önce yazılmış risk limitleri",
        "Canlıya geçiş backtest kanıtına bağlı",
      ],
    },
  },
  {
    slug: "market-terminal",
    name: "Market Terminal",
    category: "fintech",
    status: "beta",
    year: "2026",
    stack: ["Chart automation", "Daily brief", "Scheduling"],
    summary: {
      en: "Automated market reading: reads the live chart, writes the morning brief.",
      tr: "Otomatik piyasa okuması: canlı grafiği okur, sabah bültenini yazar.",
    },
    description: {
      en: "A desktop chart automation layer that pulls live indicator values, custom study levels and tables, then composes a daily bulletin with a call per theme. Analysis only — it never places an order.",
      tr: "Canlı gösterge değerlerini, özel çalışma seviyelerini ve tablolarını çeken bir masaüstü grafik otomasyon katmanı; ardından tema başına görüş içeren günlük bülteni yazıyor. Yalnızca analiz — asla emir iletmiyor.",
    },
    highlights: {
      en: [
        "Reads live studies, levels and tables from the chart",
        "Scheduled morning bulletin with a call per theme",
        "Read-only by design: no order routing",
      ],
      tr: [
        "Grafikten canlı gösterge, seviye ve tabloları okur",
        "Tema başına görüşle zamanlanmış sabah bülteni",
        "Tasarımı gereği salt-okunur: emir iletimi yok",
      ],
    },
  },

  // ─────────────────────────  AI AUTOMATION  ────────────────────────
  {
    slug: "growth-engine",
    name: "Growth Engine",
    category: "ai",
    status: "beta",
    year: "2026",
    stack: ["Multi-agent", "Playwright render", "Scheduling", "Analytics"],
    featured: true,
    summary: {
      en: "Six agents that write, render and schedule a brand's content calendar.",
      tr: "Bir markanın içerik takvimini yazan, render eden ve planlayan altı ajan.",
    },
    description: {
      en: "A content machine with a dashboard: idea agents, a copy agent, an HTML/CSS render pipeline that produces finished visuals, a quality score and a publishing calendar with a defined content taxonomy per platform.",
      tr: "Panosu olan bir içerik makinesi: fikir ajanları, metin ajanı, bitmiş görselleri üreten HTML/CSS render hattı, kalite skoru ve platform başına tanımlı içerik taksonomisiyle yayın takvimi.",
    },
    highlights: {
      en: [
        "HTML/CSS + headless browser render pipeline for finished creative",
        "Six content types with a defined conversion chain between them",
        "Diagnosis layer that names the real bottleneck, even when it is distribution",
      ],
      tr: [
        "Bitmiş kreatif için HTML/CSS + başsız tarayıcı render hattı",
        "Aralarında tanımlı dönüşüm zinciri olan altı içerik tipi",
        "Darboğaz dağıtımsa bunu da söyleyen teşhis katmanı",
      ],
    },
    metrics: [
      { label: { en: "Agents", tr: "Ajan" }, value: "6" },
      { label: { en: "Content types", tr: "İçerik tipi" }, value: "6" },
    ],
  },
  {
    slug: "persona-lab",
    name: "Persona Lab",
    category: "ai",
    status: "development",
    year: "2026",
    stack: ["Transcription", "Persona modelling", "Pipeline"],
    summary: {
      en: "Turns hours of video into a persona that can answer in someone's voice.",
      tr: "Saatlerce videoyu, birinin sesiyle cevap verebilen bir personaya çevirir.",
    },
    description: {
      en: "Video in, structured knowledge out: transcription, thematic clustering and a persona profile that keeps the source's vocabulary and positions instead of flattening them into generic assistant tone.",
      tr: "Video girer, yapılandırılmış bilgi çıkar: transkripsiyon, tematik kümeleme ve kaynağın kelime dağarcığını ve duruşunu jenerik asistan tonuna indirgemeyen persona profili.",
    },
    highlights: {
      en: [
        "Transcription to structured persona pipeline",
        "Keeps source vocabulary and stated positions",
        "Backend proven, UI layer in progress",
      ],
      tr: [
        "Transkripsiyondan yapılandırılmış personaya giden hat",
        "Kaynağın kelime dağarcığını ve duruşunu korur",
        "Backend kanıtlandı, UI katmanı devam ediyor",
      ],
    },
  },
  {
    slug: "idea-miner",
    name: "Demand Miner",
    category: "ai",
    status: "beta",
    year: "2026",
    stack: ["Reddit/HN mining", "App Store reviews", "Clustering"],
    summary: {
      en: "Finds app ideas in one-star reviews and forum complaints, not in trend lists.",
      tr: "Uygulama fikirlerini trend listelerinde değil, tek yıldızlı yorumlarda ve forum şikâyetlerinde bulur.",
    },
    description: {
      en: "Demand mining across community threads and low-rating App Store reviews, clustered into pain statements. A deliberate change from feature-first to pain-first prompting made the reports usable.",
      tr: "Topluluk başlıkları ve düşük puanlı App Store yorumlarında talep madenciliği; acı ifadelerine kümeleniyor. Özellik-önce yerine acı-önce prompt'a geçiş, raporları kullanılabilir yaptı.",
    },
    highlights: {
      en: [
        "Mines forums and 1–2★ reviews for unmet demand",
        "Pain-first clustering instead of feature lists",
        "Outputs a comparable report per niche",
      ],
      tr: [
        "Karşılanmamış talep için forumları ve 1–2★ yorumları tarar",
        "Özellik listesi yerine acı-önce kümeleme",
        "Niş başına karşılaştırılabilir rapor üretir",
      ],
    },
  },
  {
    slug: "studio-panel",
    name: "Studio Panel",
    category: "ai",
    status: "internal",
    year: "2026",
    stack: ["Python", "Local server", "JSON store"],
    summary: {
      en: "A local control panel for the studio's generated media and campaigns.",
      tr: "Stüdyonun ürettiği medya ve kampanyalar için yerel kontrol paneli.",
    },
    description: {
      en: "A dependency-light local server that collects generated assets, briefs and campaign state into one browsable surface — deliberately boring plumbing so the creative tools stay replaceable.",
      tr: "Üretilen varlıkları, brief'leri ve kampanya durumunu tek gezilebilir yüzeyde toplayan, bağımlılığı az yerel sunucu — kreatif araçlar değiştirilebilir kalsın diye bilinçli olarak sıkıcı bir tesisat.",
    },
    highlights: {
      en: [
        "Single-file standard-library server, no build step",
        "JSON + media store on disk, portable by design",
        "Keeps creative tooling swappable behind one interface",
      ],
      tr: [
        "Tek dosyalık standart kütüphane sunucusu, build adımı yok",
        "Diskte JSON + medya deposu, taşınabilir tasarım",
        "Kreatif araçları tek arayüz arkasında değiştirilebilir tutar",
      ],
    },
  },

  // ────────────────────────────  ENTERPRISE  ────────────────────────
  {
    slug: "holiday-route-planner",
    name: "Holiday Route Planner",
    category: "enterprise",
    status: "delivered",
    year: "2026",
    stack: ["Python", "Scheduling logic", "Excel I/O"],
    featured: true,
    client: { en: "Global FMCG company", tr: "Global bir FMCG şirketi" },
    summary: {
      en: "Rebuilds a national visit schedule around public holidays in minutes instead of days.",
      tr: "Ülke çapındaki ziyaret takvimini resmi tatiller etrafında günler yerine dakikalar içinde yeniden kurar.",
    },
    description: {
      en: "When a public holiday week lands, every field route has to shift without losing a customer visit or breaking frequency rules. The tool takes the standard schedule, applies the holiday calendar and produces the shifted plan with the exceptions flagged for a human.",
      tr: "Tatil haftası geldiğinde her saha rutunun, hiçbir müşteri ziyaretini kaybetmeden ve sıklık kurallarını bozmadan kayması gerekiyor. Araç standart takvimi alıyor, tatil takvimini uyguluyor ve istisnaları insana işaretleyerek kaydırılmış planı üretiyor.",
    },
    highlights: {
      en: [
        "Template-driven: the operation's own schedule format goes in and out",
        "Frequency rules preserved across the shifted week",
        "Exceptions surfaced for human decision instead of silently resolved",
      ],
      tr: [
        "Şablon tabanlı: operasyonun kendi takvim formatı girer ve çıkar",
        "Kaydırılan haftada ziyaret sıklığı kuralları korunur",
        "İstisnalar sessizce çözülmez, insan kararına sunulur",
      ],
    },
  },
  {
    slug: "distributor-revision-report",
    name: "Distributor Revision Report",
    category: "enterprise",
    status: "delivered",
    year: "2026",
    stack: ["Power BI", "Data modelling", "Audit"],
    client: { en: "Global FMCG company", tr: "Global bir FMCG şirketi" },
    summary: {
      en: "Found a quota formula error that was distorting distributor performance by 40 points.",
      tr: "Distribütör performansını 40 puan saptıran bir kota formülü hatasını buldu.",
    },
    description: {
      en: "A reporting review that started as a formatting request and ended as an audit: the quota denominator was wrong, moving a headline revision rate from 41% to 81%. Corrected model, re-issued report and a reconciled export for the teams that had used the old numbers.",
      tr: "Biçimlendirme talebi olarak başlayıp denetime dönüşen bir rapor incelemesi: kota paydası yanlıştı ve ana revize oranını %41'den %81'e taşıyordu. Düzeltilmiş model, yeniden yayınlanan rapor ve eski rakamları kullanmış ekipler için mutabık bir çıktı.",
    },
    highlights: {
      en: [
        "Root-caused a denominator error in the quota calculation",
        "Headline metric corrected from 41% to 81%",
        "Corrected workbook and CSV delivered for reconciliation",
      ],
      tr: [
        "Kota hesabındaki payda hatasının kök nedeni bulundu",
        "Ana metrik %41'den %81'e düzeltildi",
        "Mutabakat için düzeltilmiş dosya ve CSV teslim edildi",
      ],
    },
    metrics: [
      { label: { en: "Metric corrected", tr: "Düzeltilen metrik" }, value: "41% → 81%" },
    ],
  },
  {
    slug: "shipment-reconciliation",
    name: "Shipment Reconciliation",
    category: "enterprise",
    status: "delivered",
    year: "2026",
    stack: ["Python", "SAP exports", "Reconciliation"],
    client: { en: "Global FMCG company", tr: "Global bir FMCG şirketi" },
    summary: {
      en: "Reproduced a month of truck counts from raw ERP exports — and matched the approved figure exactly.",
      tr: "Bir aylık tır sayısını ham ERP çıktılarından yeniden üretti — onaylı rakamla birebir tuttu.",
    },
    description: {
      en: "Monthly truck counts were being argued over because two date fields mean two different things. The tool encodes the agreed method — which field marks vehicle assignment versus dispatch — and rebuilds the count from the raw export, reproducing the approved monthly figure.",
      tr: "Aylık tır sayıları tartışma konusuydu, çünkü iki tarih alanı iki ayrı şeyi ifade ediyor. Araç, mutabık kalınan yöntemi — hangi alanın araçlaştırmayı, hangisinin sevki gösterdiğini — kodluyor ve sayımı ham çıktıdan yeniden kurarak onaylı aylık rakamı üretiyor.",
    },
    highlights: {
      en: [
        "Encodes the agreed counting method, documented alongside the code",
        "Reproduced a full month at the approved figure",
        "Removes a recurring monthly reconciliation argument",
      ],
      tr: [
        "Mutabık kalınan sayım yöntemini kodlar, koda belge eşlik eder",
        "Bir aylık dönemi onaylı rakamla yeniden üretti",
        "Her ay tekrarlanan mutabakat tartışmasını ortadan kaldırır",
      ],
    },
    metrics: [
      { label: { en: "Verified month", tr: "Doğrulanan ay" }, value: "100%" },
    ],
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

export function projectsByCategory(slug: CategorySlug): Project[] {
  return projects.filter((p) => p.category === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
