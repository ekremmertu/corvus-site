/**
 * TAM proje verisi. **Sadece sunucu bilesenleri import etmeli.**
 * Bir istemci bileseni bu dosyadan import ederse tum metinler JS paketine
 * girer ve perdeleme anlamsizlasir — taksonomi icin "@/data/taxonomy" kullan.
 */
import {
  veilOf,
  type CardProject,
  type CategorySlug,
  type Project,
} from "./taxonomy";

export * from "./taxonomy";

export const projects: Project[] = [
  // ─────────────────────────────  iOS  ─────────────────────────────
  {
    slug: "tripwalkers",
    cover: { src: "/shots/vt-tw.jpg", srcEn: "/shots/vt-tw-en.jpg", kind: "poster" },
    stage: { kind: "phones", shots: ["/shots/tw-day.jpg", "/shots/stage/tw-overview-tr.jpg", "/shots/stage/tw-map-tr.jpg"], shotsEn: ["/shots/tw-day-en.jpg", "/shots/stage/tw-overview-en.jpg", "/shots/stage/tw-map-en.jpg"], glow: "#F25623" },
    name: "TripWalkers",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "Supabase", "StoreKit 2", "AI itinerary"],
    featured: true,
    appStoreUrl: "https://apps.apple.com/tr/app/tripwalkers/id6764424121",
    screenshots: 7,
    screenshotsSeamless: true,
    screenshotsPerLang: true,
    summary: {
      en: "Pick a city and your dates — get a day-by-day plan you can actually walk.",
      tr: "Şehri ve tarihleri seç; yürüyerek gezebileceğin gün gün planın hazır olsun.",
    },
    pitch: {
      en: "Spend the trip walking, not planning. TripWalkers guides you stop by stop on the map and adds the hidden spots guidebooks miss. It's free to download, your first plan is free and there's no subscription — plan your next city tonight.",
      tr: "Yolculuğu plan yaparak değil, gezerek geçir. TripWalkers seni haritada durak durak gezdirir, rehberlerde olmayan gizli yerleri de plana ekler. İndirmesi ücretsiz, ilk planın bedava, abonelik yok — bir sonraki şehrini bu akşam planla.",
    },
    heroArt: { src: "/brand/apps/tripwalkers-mascot.webp", kind: "mascot", glow: "rgba(232,93,42,.32)" },
    description: {
      en: "Live on the App Store. Choose your city, your pace and the things you love — TripWalkers writes your day-by-day plan. It opens offline and stays editable. Invite your friends and travel together from the same plan.",
      tr: "App Store'da yayında. Gideceğin şehri, temponu ve sevdiğin şeyleri seç; TripWalkers gün gün planını yazsın. Plan internetsiz de açılır, istediğin gibi düzenlenir. Arkadaşlarını davet et, aynı plan üzerinden birlikte gezin.",
    },
    highlights: {
      en: [
        "Shipped to the App Store and maintained through v1.2.9",
        "Group travel: shared plans with live edits and roles",
        "Adds places from Instagram and TikTok videos to your plan",
      ],
      tr: [
        "App Store'a çıkarıldı ve v1.2.9'a kadar sürdürüldü",
        "Grup gezisi: canlı düzenleme ve rollerle paylaşılan planlar",
        "Instagram ve TikTok videolarındaki mekânları plana ekler",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
      { label: { en: "Version", tr: "Sürüm" }, value: "v1.2.9" },
      { label: { en: "Languages", tr: "Dil" }, value: "TR + EN" },
    ],
    // TripWalkers'ın KENDİ domaini yok (CEO kararı 2026-08-31) → bu sayfa onun
    // tek makine-okunur GEO yüzeyi. "TripWalkers nedir" sorusunun cevabı burada.
    faq: [
      {
        q: { tr: "TripWalkers nedir?", en: "What is TripWalkers?" },
        a: {
          tr: "TripWalkers, hiç gitmediğiniz bir şehri saat saat yürünebilir bir gezi planına çeviren bir iPhone uygulamasıdır. Şehri, tarihleri, bütçeyi ve gerçekten ilgilendiğiniz şeyleri seçersiniz; uygulama günlük planı yazar.",
          en: "TripWalkers is an iPhone app that turns a city you have never visited into an hour-by-hour, walkable day plan. You pick the destination, dates, budget and what you actually care about; the app writes the itinerary.",
        },
      },
      {
        q: { tr: "Plan çevrimdışı çalışır mı?", en: "Does the plan work offline?" },
        a: {
          tr: "Evet. Oluşturulan plan cihazda durur ve internet olmadan görüntülenip düzenlenebilir — yurt dışında veri paketi olmadığında da elinizin altındadır.",
          en: "Yes. The generated plan stays on the device and can be viewed and edited without a connection — useful abroad when you have no data.",
        },
      },
      {
        q: { tr: "Aynı planı arkadaşlarımla paylaşabilir miyim?", en: "Can I share a plan with friends?" },
        a: {
          tr: "Evet. Grup gezisi özelliğiyle aynı plan üzerinden birden fazla kişi ilerleyebilir; düzenlemeler canlı yansır ve roller ayrılır.",
          en: "Yes. Group travel lets several people follow the same plan, with live edits and separate roles.",
        },
      },
      {
        q: { tr: "Ücretli mi?", en: "Is it paid?" },
        a: {
          tr: "Ücretsiz bir katmanı vardır; ek özellikler uygulama içi satın almayla açılır. App Store'da yayındadır.",
          en: "There is a free tier; additional features unlock through in-app purchases. It is live on the App Store.",
        },
      },
      {
        q: { tr: "Kim yaptı?", en: "Who built it?" },
        a: {
          tr: "İstanbul merkezli ürün stüdyosu Corvus Tech tarafından tasarlandı, geliştirildi ve App Store'a çıkarıldı.",
          en: "Designed, engineered and shipped to the App Store by Corvus Tech, a product studio based in Istanbul.",
        },
      },
    ],
  },
  {
    slug: "lingoria",
    cover: { src: "/shots/vt-lin2.jpg", srcEn: "/shots/vt-lin2-en.jpg", kind: "poster" },
    stage: {
      kind: "poster",
      head: { tr: "İngilizceyi *konuşarak* öğren.", en: "Learn English *by speaking it.*" },
      sub: { tr: "Yapay zekâ arkadaşın Lin ile günde 5 dakika sohbet.", en: "Five minutes a day chatting with Lin, your AI friend." },
      shots: ["/shots/bento-lin.jpg"],
      bg: "linear-gradient(165deg, #FDE7D2, #F4B27A 85%)",
      tone: "light",
      hl: "#B4410C",
      glow: "#F2A65A",
    },
    name: "Lingoria",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["iOS", "AI voice chat", "CEFR A1–C2"],
    appStoreUrl: "https://apps.apple.com/tr/app/id6769572261",
    screenshots: 5,
    summary: {
      en: "For Turkish speakers: a placement test, a step-by-step road map and an exit exam at every level.",
      tr: "Türkçe konuşanlar için: seviye testi, adım adım yol haritası ve her seviyede bitirme sınavı.",
    },
    pitch: {
      en: "Speak English without memorising word lists. Five minutes a day with Lin, in real conversations: the restaurant, the interview, the airport. Find your level in five minutes — free to download, start today.",
      tr: "Kelime ezberlemeden İngilizce konuş. Lin'le her gün 5 dakika gerçek diyaloglar kur: restoranda, mülakatta, havalimanında. Seviyeni 5 dakikada bul — indirmesi ücretsiz, bugün başla.",
    },
    description: {
      en: "A five-minute adaptive placement test puts the learner on the right rung, then a road map of ten units per level runs from A1 to C2. Each level closes with an exit exam across vocabulary, grammar, listening, speaking and writing, and an AI voice partner covers the part a textbook never could.",
      tr: "Beş dakikalık seviye testi seni doğru basamağa koyar; ardından A1'den C2'ye, her seviyede on bölümlük bir yol başlar. Her seviye kelime, dilbilgisi, dinleme, konuşma ve yazma sınavıyla biter. Yapay zekâ ses partneri de kitabın yapamadığını yapar: seninle konuşur.",
    },
    highlights: {
      en: [
        "Adaptive placement test — the real level in five minutes",
        "A1 to C2, ten units per level, exit exam at every step",
        "AI voice conversation instead of a silent vocabulary drill",
      ],
      tr: [
        "Uyarlanabilir seviye testi — gerçek seviye beş dakikada",
        "A1'den C2'ye, her seviyede on bölüm, her adımda çıkış sınavı",
        "Sessiz kelime ezberi yerine AI ile sesli konuşma",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
      { label: { en: "Levels", tr: "Seviye" }, value: "A1–C2" },
    ],
  },
  {
    slug: "splittable",
    cover: { src: "/shots/vt-st.jpg", srcEn: "/shots/vt-st-en.jpg", kind: "poster" },
    stage: {
      kind: "poster",
      head: { tr: "Hesap geldi.\n*Kimse hesap yapmasın.*", en: "Bill's here.\n*Nobody does the math.*" },
      sub: { tr: "QR'ı okut, ne yediysen seç, kendi payını öde.", en: "Scan the QR, pick what you ate, pay your own share." },
      shots: ["/shots/stage/st-pick.jpg"],
      shotsEn: ["/shots/stage/st-pick-en.jpg"],
      bg: "linear-gradient(160deg, #B8361A, #7A1A08 70%)",
      hl: "#FFD2B8",
      glow: "#E0442B",
      icon: "/brand/apps/splittable-icon.webp",
    },
    name: "SplitTable",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Supabase", "iPad", "XCTest"],
    featured: true,
    liveUrl: "https://splittable.me",
    appStoreUrl: "https://apps.apple.com/tr/app/splittable/id6791679838",
    alsoIn: ["web"],
    summary: {
      en: "For tables of friends: no calculators, nobody left owing anyone. Free on the App Store.",
      tr: "Arkadaş masaları için: kimse hesap makinesi çıkarmaz, kimse kimseye borçlu kalmaz. App Store'da ücretsiz.",
    },
    pitch: {
      en: "No more calculators when the bill arrives. Everyone pays only for what they ate, and nobody owes anybody. Free on the App Store — try it at your next dinner out.",
      tr: "Hesap geldiğinde hesap makinesi çıkarmaya son. Herkes yalnız kendi yediğini öder, kimse kimseye borçlu kalmaz. App Store'da ücretsiz — bir sonraki akşam yemeğinde dene.",
    },
    heroArt: { src: "/brand/apps/splittable-icon.webp", kind: "icon", glow: "rgba(196,42,20,.38)" },
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
      { label: { en: "Apps", tr: "Uygulama" }, value: "Guest + restaurant", valueTr: "Misafir + restoran" },
    ],
  },
  {
    slug: "splittable-manager",
    cover: { src: "/shots/vt-stm.jpg", srcEn: "/shots/vt-stm-en.jpg", kind: "poster" },
    stage: {
      kind: "poster",
      head: { tr: "Gün sonu raporu *hazır bekler.*", en: "End-of-day report, *ready and waiting.*" },
      sub: { tr: "Ciro, masa masa satış, kim ne yaptı — kapanışta tek ekran.", en: "Revenue, table by table, who did what — one screen at closing." },
      shots: ["/shots/stage/stm-reports.jpg"],
      shotsEn: ["/shots/stage/stm-reports-en.jpg"],
      bg: "radial-gradient(70% 90% at 85% 100%, rgba(224,68,43,.45), transparent 70%), #141416",
      hl: "#FF7A5C",
      glow: "#FF7A45",
    },
    name: "SplitTable Manager",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Supabase", "iPad", "Analytics"],
    appStoreUrl: "https://apps.apple.com/tr/app/splittable-manager/id6791680241",
    liveUrl: "https://splittable.me",
    summary: {
      en: "The iPad-first management app for restaurants on SplitTable: tables, kitchen and till, live.",
      tr: "SplitTable kullanan restoranlar için iPad öncelikli yönetim uygulaması: masalar, mutfak ve kasa canlı.",
    },
    pitch: {
      en: "The answer to 'how did today go?' on one screen. Which table earned what, what's waiting in the kitchen, what's in the till — all live. Free on the App Store; see the difference from your first service.",
      tr: "\"Bugün nasıl geçti?\" sorusunun cevabı tek ekranda. Hangi masa ne kazandırdı, mutfakta ne bekliyor, kasada ne var — hepsi canlı. App Store'da ücretsiz; farkı ilk serviste gör.",
    },
    description: {
      en: "A separate app for the staff and the owner, sharing one Supabase backbone with the guest app. Live table state, how long a table really takes to turn, which menu items carry the check — the operational layer that turns a guest feature into a reason to sign.",
      tr: "Personel ve işletmeci için ayrı bir uygulama; misafir uygulamasıyla aynı Supabase altyapısını paylaşıyor. Anlık masa durumu, bir masanın ne kadar sürede boşalıp yeniden dolduğu, ciroyu hangi menü kalemlerinin taşıdığı — restoranı SplitTable'ı kullanmaya ikna eden kısım bu ekranlar.",
    },
    highlights: {
      en: [
        "Same codebase and backbone as the guest app, separate target",
        "Table turnover and menu performance from real order data",
        "iPad-first layout for the counter, not a stretched phone screen",
      ],
      tr: [
        "Misafir uygulamasıyla aynı kod tabanı ve omurga, ayrı target",
        "Gerçek sipariş verisinden masa devir hızı ve menü performansı",
        "Kasa için iPad öncelikli düzen, esnetilmiş telefon ekranı değil",
      ],
    },
  },
  {
    slug: "blokbom",
    cover: { src: "/shots/vt-blk.jpg", kind: "poster" },
    stage: { kind: "phones", shots: ["/shots/bento-blk.jpg"], glow: "#8B5CF6" },
    name: "BlokBom!",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["iOS", "8×8 puzzle", "Offline", "6 languages"],
    appStoreUrl: "https://apps.apple.com/tr/app/id6787959211",
    summary: {
      en: "Place the piece, clear the line, beat your record. An 8×8 block puzzle with four modes.",
      tr: "Parçayı yerleştir, satırı patlat, rekorunu kır. Dört modlu 8×8 blok bulmaca.",
    },
    pitch: {
      en: "Got five minutes? Play a round of BlokBom. Place the pieces, blast the lines, beat your record — it works offline too. Free on the App Store.",
      tr: "Beş dakikan mı var? Bir el BlokBom. Parçaları yerleştir, satırları patlat, rekorunu kır — internetsiz de oynanır. App Store'da ücretsiz.",
    },
    description: {
      en: "Drag pieces onto an 8×8 board and fill a row or a column to blow it up. Four modes, among them an endless classic where a short rewarded ad buys back a dead board twice per run, and a two-minute timed sprint where every cleared line adds seconds. Plays offline, shipped in six languages.",
      tr: "Parçaları 8×8 tahtaya sürükle, satır veya sütunu doldurup patlat. Dört mod var; ikisi öne çıkıyor: hamlen bittiğinde oyun başına iki kez kısa bir reklamla devam edebildiğin sonsuz klasik ve temizlediğin her satırın süre kazandırdığı iki dakikalık yarış. İnternetsiz oynanıyor, altı dilde yayında.",
    },
    highlights: {
      en: [
        "Four modes from one board — endless, timed and beyond",
        "Rewarded continue capped at two per run, so the score still means something",
        "Offline by design, six languages at launch",
      ],
      tr: [
        "Tek tahtadan dört mod — sonsuz, süreli ve ötesi",
        "Ödüllü devam hakkı oyun başına iki ile sınırlı, skor anlamını koruyor",
        "Tasarımı gereği internetsiz, çıkışta altı dil",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
      { label: { en: "Modes", tr: "Mod" }, value: "4" },
    ],
  },
  {
    slug: "nobetgo",
    name: "NöbetGO",
    category: "ios",
    status: "beta",
    veil: "soon",
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
    veil: "soon",
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
    veil: "soon",
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
    veil: "soon",
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
    veil: "soon",
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
    veil: "soon",
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
    veil: "soon",
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
    slug: "quill",
    cover: { src: "/shots/vt-q2.jpg", srcEn: "/shots/vt-q2-en.jpg", kind: "poster" },
    stage: { kind: "phones", shots: ["/shots/vt-q2.jpg", "/appstore/quill/3.jpg", "/appstore/quill/2.jpg"], shotsEn: ["/shots/vt-q2-en.jpg"], glow: "#B6F23A" },
    name: "Quill",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "SwiftData", "StoreKit 2"],
    featured: true,
    appStoreUrl: "https://apps.apple.com/tr/app/id6768395513",
    screenshots: 5,
    summary: {
      en: "No budget guilt. A personal finance app that shows you which debt to clear first.",
      tr: "Suçlamaz, yol gösterir: borçlarını hangi sırayla kapatacağını gösteren kişisel finans uygulaması.",
    },
    pitch: {
      en: "Stop wondering where your salary went. Quill shows the order to pay off your debts, keeps your goals on track, and Kuzgun tells you plainly how the month is going. Free to download, with a 7-day free trial of Pro.",
      tr: "Maaşın nereye gitti diye düşünmeyi bırak. Quill borçlarını hangi sırayla kapatacağını gösterir, hedeflerini takip eder; Kuzgun da ayın gidişatını açık açık söyler. İndirmesi ücretsiz, Pro'yu 7 gün bedava dene.",
    },
    description: {
      en: "Quill models your debts and goals, orders them with the avalanche or snowball method and shows what even a small extra amount actually changes. Now live on the App Store, signed and delivered through an automated archive → export → upload pipeline.",
      tr: "Quill borçlarını ve hedeflerini modelliyor, çığ veya kartopu yöntemiyle sıralıyor ve borca ayıracağın küçük bir ekstranın bile neyi değiştirdiğini gösteriyor. App Store'da yayında; otomatik archive → export → yükleme hattıyla imzalanıp teslim ediliyor.",
    },
    highlights: {
      en: [
        "Strategy engine that orders your debts and simulates putting a little extra toward them",
        "Goals and expense tracking on one SwiftData model layer",
        "Automated signing and App Store delivery pipeline",
      ],
      tr: [
        "Borçları kapatma sırasını belirleyen ve ekstra katkıyı simüle eden strateji motoru",
        "Tek SwiftData model katmanında hedef ve gider takibi",
        "Otomatik imzalama ve App Store teslim hattı",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
    ],
  },
  {
    slug: "star-striker",
    name: "Star Striker",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["iOS", "Career sim", "Offline"],
    appStoreSoon: true,
    summary: {
      en: "Step onto the pitch at 17 — take the shot and run your own career.",
      tr: "17 yaşında sahaya çık: şutu sen at, kariyerini sen yönet.",
    },
    pitch: {
      en: "Your career starts at 17 and every shot is yours to take. Star Striker is coming to the App Store soon — write to us and be among the first to play.",
      tr: "Kariyerin 17 yaşında başlıyor, her şutu sen atıyorsun. Star Striker çok yakında App Store'da — bize yaz, ilk oynayanlardan ol.",
    },
    description: {
      en: "You aim the shot and set its power yourself, so the goal is actually yours. But the real game starts off the pitch: an amateur club nobody watches, a career to build, and the life decisions around it. Not a match engine with a name attached — a life you play season by season.",
      tr: "Şutun nişanını da gücünü de sen ayarlıyorsun; attığın gol gerçekten senin golün. Ama asıl oyun sahanın dışında başlıyor: kimsenin izlemediği amatör bir kulüp, kurulacak bir kariyer ve etrafındaki hayat kararları. İsim yapıştırılmış bir maç motoru değil — sezon sezon oynadığın bir hayat.",
    },
    highlights: {
      en: [
        "You aim and power every shot — no auto-resolve",
        "The career runs off the pitch too, not just on match day",
        "Starts amateur at 17, the ceiling is earned",
      ],
      tr: [
        "Her şutun nişanı ve gücü sende — otomatik sonuçlanma yok",
        "Kariyer maç gününde değil, saha dışında da işliyor",
        "17 yaşında amatörde başlıyor, tavan kazanılıyor",
      ],
    },
  },
  {
    slug: "orbit-dash",
    name: "Orbit Dash",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["iOS", "One-tap arcade", "Offline"],
    appStoreSoon: true,
    summary: {
      en: "Tap once to switch orbits and see how far you get before the spikes catch you.",
      tr: "Tek dokunuşla yörünge değiştir; dikenlere yakalanmadan ne kadar ilerleyebildiğini gör.",
    },
    pitch: {
      en: "One tap, one orbit, one more try. Orbit Dash is coming to the App Store soon — write to us and be among the first to play.",
      tr: "Tek dokunuş, tek yörünge, bir deneme daha. Orbit Dash çok yakında App Store'da — bize yaz, ilk oynayanlardan ol.",
    },
    description: {
      en: "Tap to jump between orbit rings, time it past the spikes, collect diamonds and trigger fever streaks. One control, learned in a second; the mastery is entirely in the timing.",
      tr: "Yörünge halkaları arasında geçmek için dokun, dikenlerin arasından geçeceğin anı yakala, elmasları topla ve ateş serilerini başlat. Tek kontrol, bir saniyede öğrenilir; ustalık tamamen zamanlamada.",
    },
    highlights: {
      en: [
        "Single tap control — pure reflex, no tutorial needed",
        "Fever streaks reward the run, not the wallet",
        "Neon-space art with an endless ladder to climb",
      ],
      tr: [
        "Tek dokunuş kontrol — saf refleks, öğretici gerekmiyor",
        "Ateş serileri para değil, ilerleme kazandırıyor",
        "Neon-uzay estetiği ve tırmanılacak sonsuz basamak",
      ],
    },
  },
  {
    slug: "stacky-tower",
    name: "Stacky Tower Blocks",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["iOS", "One-tap arcade", "Offline"],
    appStoreSoon: true,
    summary: {
      en: "Tap to drop the block. Nail the timing and your tower climbs all the way to space.",
      tr: "Dokun, bloğu bırak. Zamanlaman kusursuzsa kulen uzaya kadar yükselir.",
    },
    pitch: {
      en: "How high can your timing take you? Stacky Tower is coming to the App Store soon — write to us and be among the first to play.",
      tr: "Zamanlaman seni ne kadar yükseğe çıkarır? Stacky Tower çok yakında App Store'da — bize yaz, ilk oynayanlardan ol.",
    },
    description: {
      en: "A sliding block passes above the tower; tap at the right moment to drop it. Whatever hangs over the edge gets sliced away, so sloppy timing narrows the tower until there is nothing left to land on. Climb from sunset skies into space, with themes and daily runs along the way.",
      tr: "Kulenin üstünde kayan bir blok geçer; doğru anda dokunup bırakırsın. Kenardan taşan kısım kesilir, yani özensiz zamanlama kuleyi daraltır ve sonunda konacak yer kalmaz. Gün batımı göklerinden uzaya tırmanıyorsun; yolda temalar ve günlük koşular var.",
    },
    highlights: {
      en: [
        "One tap, and the punishment for missing it is visible immediately",
        "Perfect stacks compound — the combo is the whole skill curve",
        "Sunset to space progression with unlockable themes",
      ],
      tr: [
        "Tek dokunuş, kaçırmanın cezası anında gözle görülüyor",
        "Kusursuz dizilişler birikiyor — kombo, becerinin tamamı",
        "Gün batımından uzaya ilerleyiş, açılabilir temalar",
      ],
    },
  },
  {
    slug: "knife-smash",
    name: "Knife Smash Arena",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["iOS", "40 levels", "Offline"],
    appStoreSoon: true,
    summary: {
      en: "Forty hand-designed levels with the same layout every time — beat them by learning, not luck.",
      tr: "Elle tasarlanmış 40 bölüm, her seferinde aynı dizilim: şansla değil, öğrenerek geç.",
    },
    pitch: {
      en: "Forty levels where skill beats luck. Knife Smash Arena is coming to the App Store soon — write to us and be among the first to play.",
      tr: "Şansın değil, ustalığın kazandığı 40 bölüm. Knife Smash Arena çok yakında App Store'da — bize yaz, ilk oynayanlardan ol.",
    },
    description: {
      en: "Tap to throw, land every knife in the spinning log, and never touch a blade you already stuck. The forty levels are hand-built and deterministic: the same run every time, so a failure is information rather than bad luck. An endless mode carries the leaderboard.",
      tr: "Dokun ve fırlat, her bıçağı dönen kütüğe sapla, önceden sapladığın bıçağa asla değme. Kırk bölüm elle kuruldu ve deterministik: her seferinde aynı diziliş, yani başarısızlık kötü şans değil bilgi. Liderlik tablosu sonsuz modda.",
    },
    highlights: {
      en: [
        "Deterministic levels — the same deal every attempt, so skill compounds",
        "Forty hand-designed stages instead of endless generation",
        "Endless mode kept separate, for the leaderboard",
      ],
      tr: [
        "Deterministik bölümler — her denemede aynı diziliş, beceri birikiyor",
        "Sonsuz üretim yerine kırk elle tasarlanmış bölüm",
        "Liderlik tablosu için ayrı tutulan sonsuz mod",
      ],
    },
  },
  {
    slug: "amelie-co",
    cover: { src: "/shots/web-am.jpg", srcEn: "/shots/web-am-en.jpg", kind: "web" },
    stage: {
      kind: "poster",
      head: { tr: "Davetiyen *bir film gibi* açılsın.", en: "Your invitation, *opening like a film.*" },
      sub: { tr: "Tek link, zarif bir dijital davetiye. Misafirlerin unutmaz.", en: "One link, an elegant digital invitation your guests remember." },
      shots: ["/shots/stage/am-preview.jpg"],
      shotsEn: ["/shots/stage/am-preview-en.jpg"],
      bg: "linear-gradient(165deg, #FBF5EC, #E9D3B5 90%)",
      tone: "light",
      hl: "#9C2F3E",
      glow: "#C9A27A",
    },
    name: "Ameliea",
    category: "web",
    status: "live",
    year: "2026",
    stack: ["Next.js", "Supabase", "Theme engine"],
    featured: true,
    liveUrl: "https://ameliea.co",
    appStoreSoon: true,
    alsoIn: ["ios"],
    summary: {
      en: "Pick a theme, add your guest list and follow every RSVP from one panel.",
      tr: "Temanı seç, misafir listeni ekle, katılım yanıtlarını tek panelden takip et.",
    },
    pitch: {
      en: "Let your invitation open like a film on every guest's phone. Pick a theme, add your guest list and follow every RSVP from one panel. Create yours on ameliea.co today.",
      tr: "Davetiyen her misafirin telefonunda bir film gibi açılsın. Temanı seç, misafir listeni ekle, LCV yanıtlarını tek panelden takip et. Davetiyeni bugün ameliea.co'da oluştur.",
    },
    description: {
      en: "Pick a theme from the library, tell your story in the editor, invite your guests and collect their RSVPs in one place. Each theme is art-directed for a specific bride persona rather than being a colour swap of the last one.",
      tr: "Tema kütüphanesinden birini seç, editörde hikâyeni yaz, misafirlerini davet edip katılım yanıtlarını (RSVP) tek yerde topla. Her tema, bir öncekinin renk varyantı değil; belirli bir gelin personası için ayrı ayrı sanat yönetimiyle kurgulanıyor.",
    },
    highlights: {
      en: [
        "Guest list and RSVP replies in one panel",
        "Theme library with per-theme art direction and cinematic promos",
        "Companion iOS app in TestFlight on the same Supabase backend",
      ],
      tr: [
        "Misafir listesi ve katılım yanıtları tek panelde",
        "Tema başına sanat yönetimi ve sinematik tanıtımlar",
        "Aynı Supabase arkasında TestFlight'ta eşlik eden iOS uygulaması",
      ],
    },
    metrics: [
    ],
  },
  {
    slug: "supply-chain-council",
    cover: { src: "/shots/scc-team.jpg", kind: "web" },
    stage: { kind: "art", shots: ["/shots/stage/art-council-tr.jpg"], shotsEn: ["/shots/stage/art-council-en.jpg"], glow: "#2DD4BF", alt: { tr: "Sekiz rol bir vakayı tartışıyor ve karşı görüşü de içeren, kanıtlı bir karar notu çıkarıyor.", en: "Eight roles debate a case and produce an evidence-backed decision note that includes the dissent." } },
    name: "Supply Chain Council",
    category: "web",
    status: "beta",
    year: "2026",
    stack: ["Next.js", "FastAPI", "Multi-agent", "Claude"],
    featured: true,
    summary: {
      en: "Bring your supply chain decision to eight AI experts — they debate it and hand you a decision memo.",
      tr: "Tedarik zinciri kararını sekiz AI uzmanına danış; tartışsınlar, sana bir karar notu çıkarsınlar.",
    },
    description: {
      en: "Upload a case — a disruption, an improvement idea, a post-mortem — and a council of eight domain personas debates it in rounds, challenges each other's evidence and produces a decision document with dissenting opinions attached.",
      tr: "Bir vaka yükle — kesinti, iyileştirme fikri ya da geriye dönük inceleme — sekiz alan personasından oluşan meclis turlar hâlinde tartışsın, birbirinin kanıtını sorgulasın ve karşı görüşleri de ekli bir karar dokümanı üretsin.",
    },
    highlights: {
      en: [
        "Eight expert personas with independent evidence standards",
        "Three case types: action, improvement and forensic",
        "80+ term glossary so the output reads like a real memo",
      ],
      tr: [
        "Bağımsız kanıt standardı olan sekiz uzman persona",
        "Üç vaka tipi: aksiyon, iyileştirme ve geriye dönük inceleme",
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
    cover: { src: "/shots/web-cv.jpg", srcEn: "/shots/web-cv-en.jpg", kind: "web" },
    stage: { kind: "web", shots: ["/shots/web-cv.jpg"], shotsEn: ["/shots/web-cv-en.jpg"], url: "cvtoapply.co", phone: "/shots/stage/cv-rapor.jpg", phoneEn: "/appstore/cvtoapply/1.jpg", glow: "#F2B81C" },
    name: "CVtoapply",
    category: "web",
    status: "live",
    year: "2026",
    stack: ["Next.js", "FastAPI", "Anthropic API"],
    liveUrl: "https://cvtoapply.co",
    appStoreUrl: "https://apps.apple.com/tr/app/id6790497658",
    screenshots: 5,
    summary: {
      en: "Paste the job posting — your CV is rewritten for it, readable by ATS on the first pass.",
      tr: "İlanı yapıştır; CV'n o ilana göre, ATS'nin ilk okumada anlayacağı şekilde yeniden yazılsın.",
    },
    pitch: {
      en: "Not hearing back may not be about you — the software may simply not be reading your CV. CVtoapply rewrites it for the job and shows you what the ATS sees. Your first analysis is free, no card needed.",
      tr: "Başvurularına dönüş alamıyorsan sorun sen değil, CV'nin okunmaması olabilir. CVtoapply CV'ni ilana göre yeniden yazar, yazılımın onu nasıl gördüğünü gösterir. İlk analiz ücretsiz, kart gerekmez.",
    },
    description: {
      en: "Paste a job ad, upload any CV layout — sidebar, two-column, designed — and the parser reads it structurally instead of guessing. Then a two-panel editor shows what is missing before it produces the ATS-optimised version.",
      tr: "İlanı yapıştır, CV'ni hangi düzende olursa olsun yükle — kenar çubuklu, çok sütunlu, tasarımlı. CV'n tahminle değil, yapısı çözülerek okunur. Ardından iki panelli editör, ATS'ye uygun sürümü yazmadan önce eksiklerini gösterir.",
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
    veil: "soon",
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
    stage: { kind: "web", shots: ["/shots/stage/anaokulu-harita.jpg"], shotsEn: ["/shots/stage/anaokulu-harita-en.jpg"], glow: "#2E8B74" },
    name: "Preschool Location Radar",
    nameTr: "Anaokulu Lokasyon Radarı",
    category: "web",
    status: "live",
    year: "2026",
    stack: ["Data analysis", "Interactive maps", "Investor reporting"],
    summary: {
      en: "Where should the preschool open? We mapped a 15 km catchment so the decision rests on data, not guesswork.",
      tr: "Anaokulu nereye açılmalı? 15 km'lik bölgeyi haritada inceledik; karar tahmine değil veriye dayandı.",
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
      en: "Our internal system that carries a product idea from brief to a shipped app.",
      tr: "Bir ürün fikrini ilk taslaktan yayındaki uygulamaya taşıyan iç sistemimiz.",
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
    stage: { kind: "art", shots: ["/shots/stage/art-heimdall-tr.jpg"], shotsEn: ["/shots/stage/art-heimdall-en.jpg"], glow: "#F2B33D", alt: { tr: "Radar çizimi: 600 hisse tek taramada; sinyal oluşan hisse işaretleniyor.", en: "Radar illustration: 600 stocks in one scan; the stock where a signal forms is flagged." } },
    name: "Heimdall Radar",
    category: "fintech",
    status: "live",
    year: "2026",
    stack: ["Pine Script", "Screener", "Signal engine"],
    featured: true,
    summary: {
      en: "Scans 600 Borsa Istanbul stocks and alerts you the moment your signal forms.",
      tr: "600 BIST hissesini tarar, tanımladığın sinyal oluştuğu an haber verir.",
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
    stage: { kind: "art", shots: ["/shots/stage/art-crypto-tr.jpg"], shotsEn: ["/shots/stage/art-crypto-en.jpg"], glow: "#36E2B4", alt: { tr: "Üç coinin yarışı; lider değişince bot da yön değiştiriyor. 20 testin 15'i pozitif, 5 negatif test de raporda.", en: "Three coins racing; when the leader changes the bot switches too. 15 of 20 tests positive, the 5 negative ones are reported too." } },
    name: "LiveCryptoBot",
    category: "fintech",
    status: "live",
    year: "2026",
    stack: ["Python", "Walk-forward", "Exchange API"],
    featured: true,
    summary: {
      en: "Follows whichever of three coins is leading — and reports its drawdowns openly.",
      tr: "Üç kripto arasında öne geçeni takip eder; düşüşlerini de saklamadan raporlar.",
    },
    description: {
      en: "Leader–follower logic across three correlated symbols, validated with walk-forward windows rather than a single flattering backtest. Fifteen of twenty windows came out positive; the average drawdown is published next to the wins.",
      tr: "Birlikte hareket eden üç coin arasında lider–takipçi mantığı; tek bir parlak backtest yerine walk-forward pencereleriyle doğrulandı. Yirmi pencerenin on beşi pozitif çıktı; ortalama düşüş, kazançların yanında yayınlanıyor.",
    },
    highlights: {
      en: [
        "15/20 walk-forward windows positive (75%)",
        "Averaged 10R (risk units) a month in validation",
        "~23% average max drawdown per test period, reported alongside returns",
      ],
      tr: [
        "20 walk-forward penceresinin 15'i pozitif (%75)",
        "Doğrulamada ayda ortalama 10R (risk birimi) kazanç",
        "Test dönemi başına en derin düşüşün ortalaması ~%23 — getirilerin yanında raporlandı",
      ],
    },
    metrics: [
      { label: { en: "Positive tests", tr: "Pozitif test" }, value: "15/20" },
      { label: { en: "Avg drawdown", tr: "Ort. düşüş" }, value: "~23%", valueTr: "~%23" },
    ],
  },
  {
    slug: "radarcrypto",
    name: "RadarCrypto",
    category: "fintech",
    status: "live",
    year: "2026",
    stack: ["Python", "Pattern mining", "Backtest"],
    summary: {
      en: "Which BTC and ETH patterns actually work? We tested them all — including the ones that failed.",
      tr: "BTC ve ETH'de hangi formasyonlar gerçekten işe yarıyor? Tutmayanlar dâhil hepsini test ettik.",
    },
    description: {
      en: "Pre-pump sequence detection and oversold z-score studies, run through a discipline that separates a screener lift from a tradable edge. Findings that failed walk-forward are documented as failures.",
      tr: "Yükseliş öncesi dizileri ve aşırı satım sinyallerini inceleyen çalışmalar. Tarayıcıda iyi görünen sinyal ile gerçekten para kazandıran sinyal ayrı tutuluyor. Walk-forward testinde düşen bulgular başarısızlık olarak kayda geçiyor.",
    },
    highlights: {
      en: [
        "Pre-pump sequence research on major pairs",
        "Explicit separation of screener lift and backtested edge",
        "Negative results kept in the record",
      ],
      tr: [
        "Ana paritelerde yükseliş öncesi dizi araştırması",
        "Tarayıcıdaki sinyal ile gerçek kazanç ayrı ölçülüyor",
        "Negatif sonuçlar kayıtta tutuluyor",
      ],
    },
  },
  {
    slug: "takim-kur",
    name: "Systematic Portfolio",
    nameTr: "Sistematik Portföy",
    category: "fintech",
    status: "live",
    year: "2026",
    stack: ["Portfolio rules", "Rebalancing", "Risk limits"],
    summary: {
      en: "A rules-based portfolio: rebalancing isn't optional, it's built in.",
      tr: "Kurallarla yönetilen portföy: dengeleme isteğe bağlı değil, zorunlu.",
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
    stage: { kind: "art", shots: ["/shots/stage/art-terminal-tr.jpg"], shotsEn: ["/shots/stage/art-terminal-en.jpg"], glow: "#4C7DFF", alt: { tr: "Grafiği okuyan tarama çizgisi ve her sabah 08:00'de hazır bülten: tema başına görüş. Yalnız analiz, emir iletmez.", en: "A scan line reading the chart and a brief ready every morning at 08:00, one call per theme. Analysis only, no orders." } },
    name: "Market Terminal",
    category: "fintech",
    status: "live",
    year: "2026",
    stack: ["Chart automation", "Daily brief", "Scheduling"],
    summary: {
      en: "Reads the live chart and writes your morning brief for you.",
      tr: "Canlı grafiği okur, sabah bültenini senin yerine yazar.",
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
    cover: { src: "/shots/growth.jpg", srcEn: "/shots/growth-en.jpg", kind: "web" },
    stage: { kind: "art", shots: ["/shots/stage/art-growth-tr.jpg"], shotsEn: ["/shots/stage/art-growth-en.jpg"], glow: "#FF7A59", alt: { tr: "Haftalık içerik takvimi: altı ajanın yazıp hazırladığı post, reel ve story'ler yedi güne yerleşmiş.", en: "Weekly content calendar: posts, reels and stories written and prepared by six agents, placed across seven days." } },
    name: "Growth Engine",
    category: "ai",
    status: "live",
    year: "2026",
    stack: ["Multi-agent", "Playwright render", "Scheduling", "Analytics"],
    featured: true,
    summary: {
      en: "Six agents write, design and schedule your brand's content.",
      tr: "Altı ajan markanın içeriğini yazar, görselleştirir ve takvime yerleştirir.",
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
    status: "live",
    year: "2026",
    stack: ["Transcription", "Persona modelling", "Pipeline"],
    summary: {
      en: "Turns hours of video into a persona that answers in that person's voice.",
      tr: "Saatlerce videodan, o kişinin sesiyle cevap veren bir persona çıkarır.",
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
    stage: { kind: "art", shots: ["/shots/stage/art-dert-tr.jpg"], shotsEn: ["/shots/stage/art-dert-en.jpg"], glow: "#F0508F", alt: { tr: "Dert ve para grafiği: insanların en çok dertlendiği konular solda, o derde para harcayanlar sağda; ikisinin de yüksek olduğu satırda fikir var.", en: "Pain versus pay chart: what people complain about most on the left, who spends money on it on the right; the idea sits where both are high." } },
    name: "Demand Miner",
    nameTr: "Dert Motoru",
    category: "ai",
    status: "live",
    year: "2026",
    stack: ["Reddit/HN mining", "App Store reviews", "Clustering"],
    summary: {
      en: "Find your next app idea in one-star reviews and forum complaints, not trend lists.",
      tr: "Uygulama fikrini trend listelerinde değil, tek yıldızlı yorumlarda ve forum şikâyetlerinde bul.",
    },
    description: {
      en: "Demand mining across community threads and low-rating App Store reviews, clustered into pain statements. A deliberate change from feature-first to pain-first prompting made the reports usable.",
      tr: "Forum başlıklarını ve düşük puanlı App Store yorumlarını tarar, insanların yaşadığı dertleri gruplar. Önce özelliği değil önce derdi soran yaklaşım, raporları işe yarar hâle getirdi.",
    },
    highlights: {
      en: [
        "Mines forums and 1–2★ reviews for unmet demand",
        "Pain-first clustering instead of feature lists",
        "Outputs a comparable report per niche",
      ],
      tr: [
        "Karşılanmamış talep için forumları ve 1–2★ yorumları tarar",
        "Özellik listesi yerine dert odaklı gruplama",
        "Niş başına karşılaştırılabilir rapor üretir",
      ],
    },
  },
  {
    slug: "studio-panel",
    name: "Studio Panel",
    category: "ai",
    status: "live",
    year: "2026",
    stack: ["Python", "Local server", "JSON store"],
    summary: {
      en: "All of the studio's generated media and campaigns in one local panel.",
      tr: "Stüdyonun ürettiği tüm medya ve kampanyalar tek bir yerel panelde.",
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
    status: "live",
    veil: "confidential",
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
    slug: "shipment-reconciliation",
    name: "Shipment Reconciliation",
    category: "enterprise",
    status: "live",
    veil: "confidential",
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


export function projectsByCategory(slug: CategorySlug): Project[] {
  return projects.filter((p) => p.category === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);

/** Detay sayfasi uretilen projeler. Perdeliler 404 doner. */
export const openProjects = (): Project[] => projects.filter((p) => veilOf(p) === null);

/**
 * Kart sirasi — CEO karari 2026-08-23: her sekmede once yayindakiler,
 * sonra "iOS geliyor", sonra digerleri, EN ALTTA perdeliler.
 * Kartin GORUNEN durumuna gore siralanir, veri detayina gore degil.
 */
function rankOf(p: Project): number {
  const veil = veilOf(p);
  if (veil === "confidential") return 4;
  if (veil) return 3;
  if (p.status === "live" || p.appStoreUrl) return 0;
  if (p.appStoreSoon) return 1;
  return 2;
}

/** Istemciye gecen sanitize edilmis liste. */
export function toCards(list: Project[] = projects): CardProject[] {
  return list
    .map((p, i) => {
    const veil = veilOf(p);
    const base = {
      rank: rankOf(p),
      // Perdeli projede GERCEK slug bile gonderilmez: "shipment-reconciliation"
      // gibi bir adres isin ne oldugunu ele veriyor. Yerine anlamsiz bir anahtar.
      slug: veil ? `veiled-${i}` : p.slug,
      category: p.category,
      status: p.status,
      stack: p.stack,
      veil,
    };
    return veil
      ? base
      : {
          ...base,
          name: p.name,
          summary: p.summary,
          metrics: p.metrics,
          appStoreSoon: p.appStoreSoon,
          cover: p.cover,
          stage: p.stage,
          nameTr: p.nameTr,
        };
    })
    .flatMap((card, i) => {
      // alsoIn: aynı kart ikinci sekmede de görünür. Detay sayfası ortak,
      // sadece kategori rozeti/rengi o sekmenin rengi olur.
      const extra = (list[i].alsoIn ?? []).map((cat) => ({
        ...card,
        category: cat,
        dup: true,
      }));
      return [card, ...extra];
    })
    // Aynı rank'te ürün sahnesi olan kart öne: vitrin görselle açılır (12.10.2026).
    .sort((a, b) => a.rank - b.rank || Number(!("stage" in a && a.stage)) - Number(!("stage" in b && b.stage))); // Array.sort kararlı
}

/** Disiplin basina proje sayisi — Hero sayaci icin (metin tasimaz). */
export function countsByCategory(): Record<CategorySlug, number> {
  return projects.reduce(
    (acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }),
    {} as Record<CategorySlug, number>
  );
}
