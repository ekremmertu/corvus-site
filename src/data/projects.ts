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
    name: "TripWalkers",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "Supabase", "StoreKit 2", "AI itinerary"],
    featured: true,
    appStoreUrl: "https://apps.apple.com/tr/app/tripwalkers/id6764424121",
    screenshots: 5,
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
    status: "live",
    year: "2026",
    stack: ["SwiftUI", "Swift 6", "SwiftData", "StoreKit 2"],
    featured: true,
    appStoreUrl: "https://apps.apple.com/tr/app/id6768395513",
    screenshots: 5,
    summary: {
      en: "Personal finance app built around debt payoff strategy, not budget guilt.",
      tr: "Bütçe suçluluğu değil, borç kapatma stratejisi üzerine kurulmuş kişisel finans uygulaması.",
    },
    description: {
      en: "Quill models your debts and goals, then orders them with avalanche or snowball logic and shows what one extra payment actually changes. Now live on the App Store, signed and delivered through an automated archive → export → upload pipeline.",
      tr: "Quill borçlarını ve hedeflerini modelliyor, çığ veya kartopu mantığıyla sıralıyor ve tek bir ek ödemenin neyi değiştirdiğini gösteriyor. App Store'da yayında; otomatik archive → export → yükleme hattıyla imzalanıp teslim ediliyor.",
    },
    highlights: {
      en: [
        "Debt strategy engine with payoff ordering and extra-payment simulation",
        "Goals and expense tracking on one SwiftData model layer",
        "Automated signing and App Store delivery pipeline",
      ],
      tr: [
        "Ödeme sıralaması ve ek-ödeme simülasyonu olan borç stratejisi motoru",
        "Tek SwiftData model katmanında hedef ve gider takibi",
        "Otomatik imzalama ve App Store teslim hattı",
      ],
    },
    metrics: [
      { label: { en: "Status", tr: "Durum" }, value: "App Store" },
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
    liveUrl: "https://splittable.me",
    appStoreSoon: true,
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
    slug: "splittable-manager",
    name: "SplitTable Manager",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["SwiftUI", "Supabase", "iPad", "Analytics"],
    appStoreSoon: true,
    liveUrl: "https://splittable.me",
    summary: {
      en: "The restaurant side of SplitTable: what every split table is actually telling the owner.",
      tr: "SplitTable'ın restoran tarafı: bölünen her hesabın işletmeciye aslında ne anlattığı.",
    },
    description: {
      en: "A separate app for the staff and the owner, sharing one Supabase backbone with the guest app. Live table state, how long a table really takes to turn, which menu items carry the check — the operational layer that turns a guest feature into a reason to sign.",
      tr: "Personel ve işletmeci için ayrı bir uygulama; misafir uygulamasıyla aynı Supabase omurgasını paylaşıyor. Anlık masa durumu, bir masanın gerçekte ne kadar sürede devrettiği, hesabı hangi menü kalemlerinin taşıdığı — misafir özelliğini imza sebebine çeviren operasyon katmanı.",
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
    slug: "lingoria",
    name: "Lingoria",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["iOS", "AI voice chat", "CEFR A1–C2"],
    appStoreUrl: "https://apps.apple.com/tr/app/id6769572261",
    screenshots: 5,
    summary: {
      en: "English for Turkish speakers, levelled to CEFR — and it talks back.",
      tr: "Türkçe konuşanlar için İngilizce — CEFR seviyeli ve karşılık veriyor.",
    },
    description: {
      en: "A five-minute adaptive placement test puts the learner on the right rung, then a ten-unit road map runs from A1 to C2. Each level closes with an exit exam across vocabulary, grammar, listening, speaking and writing, and an AI voice partner covers the part a textbook never could.",
      tr: "Beş dakikalık uyarlanabilir seviye testi öğrenciyi doğru basamağa koyuyor, ardından A1'den C2'ye onar bölümlük yol haritası işliyor. Her seviye kelime, dilbilgisi, dinleme, konuşma ve yazma sınavıyla kapanıyor; AI sesli partner de kitabın asla yapamadığı kısmı üstleniyor.",
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
    slug: "blokbom",
    name: "BlokBom!",
    category: "ios",
    status: "live",
    year: "2026",
    stack: ["iOS", "8×8 puzzle", "Offline", "6 languages"],
    appStoreUrl: "https://apps.apple.com/tr/app/id6787959211",
    summary: {
      en: "An 8×8 block puzzle with four modes — place the piece, clear the line, chase the record.",
      tr: "Dört modlu 8×8 blok bulmaca — parçayı yerleştir, satırı patlat, rekoru kovala.",
    },
    description: {
      en: "Drag pieces onto an 8×8 board and fill a row or a column to blow it up. Four modes, among them an endless classic where a short rewarded ad buys back a dead board twice per run, and a two-minute timed sprint where every cleared line adds seconds. Plays offline, shipped in six languages.",
      tr: "Parçaları 8×8 tahtaya sürükle, satır veya sütunu doldurup patlat. Dört mod var: hamlesi biten tahtayı oyun başına iki kez kısa bir ödüllü reklamla geri alabildiğin sonsuz klasik ve temizlenen her satırın süre kazandırdığı iki dakikalık yarış. İnternetsiz oynanıyor, altı dilde yayında.",
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
    slug: "star-striker",
    name: "Star Striker",
    category: "ios",
    status: "beta",
    year: "2026",
    stack: ["iOS", "Career sim", "Offline"],
    appStoreSoon: true,
    summary: {
      en: "A football career that starts at 17 — you take the shot, and you spend the money.",
      tr: "17 yaşında başlayan bir futbol kariyeri — şutu sen atıyorsun, parayı da sen harcıyorsun.",
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
      en: "One tap changes your orbit. Miss the timing and the spikes end the run.",
      tr: "Tek dokunuş yörüngeni değiştirir. Zamanlamayı kaçırırsan dikenler koşuyu bitirir.",
    },
    description: {
      en: "Tap to jump between orbit rings, time it past the spikes, collect diamonds and trigger fever streaks. One control, learned in a second; the mastery is entirely in the timing.",
      tr: "Yörünge halkaları arasında geçmek için dokun, zamanlamayı dikenlerin arasından tutur, elmasları topla ve fever serilerini tetikle. Tek kontrol, bir saniyede öğrenilir; ustalık tamamen zamanlamada.",
    },
    highlights: {
      en: [
        "Single tap control — pure reflex, no tutorial needed",
        "Fever streaks reward the run, not the wallet",
        "Neon-space art with an endless ladder to climb",
      ],
      tr: [
        "Tek dokunuş kontrol — saf refleks, öğretici gerekmiyor",
        "Fever serileri cüzdanı değil koşuyu ödüllendiriyor",
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
      en: "Tap to drop the block. Perfect timing slices nothing off — and the tower reaches space.",
      tr: "Bloğu bırakmak için dokun. Zamanlama kusursuzsa hiçbir şey kesilmez — kule uzaya çıkar.",
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
      en: "Forty hand-designed levels that deal the same every run — you get past them by learning, not by luck.",
      tr: "Her oynayışta aynı dizilen 40 elle tasarlanmış bölüm — şansla değil, öğrenerek geçiliyor.",
    },
    description: {
      en: "Tap to throw, land every knife in the spinning log, and never touch a blade you already stuck. The forty levels are hand-built and deterministic: the same run every time, so a failure is information rather than bad luck. An endless mode carries the leaderboard.",
      tr: "Dokun ve fırlat, her bıçağı dönen kütüğe sapla, önceden sapladığın bıçağa asla değme. Kırk bölüm elle kuruldu ve deterministik: her seferinde aynı diziliş, yani başarısızlık kötü şans değil bilgi. Liderlik tablosunu sonsuz mod taşıyor.",
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
    name: "Amelie.co",
    category: "web",
    status: "live",
    year: "2026",
    stack: ["Next.js", "Supabase", "iyzico", "Theme engine"],
    featured: true,
    liveUrl: "https://ameliea.co",
    appStoreSoon: true,
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
    liveUrl: "https://cvtoapply.co",
    appStoreUrl: "https://apps.apple.com/tr/app/id6790497658",
    screenshots: 5,
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
    status: "delivered",
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
        };
    })
    .sort((a, b) => a.rank - b.rank); // Array.sort kararlı: eşit rank'te veri sırası korunur
}

/** Disiplin basina proje sayisi — Hero sayaci icin (metin tasimaz). */
export function countsByCategory(): Record<CategorySlug, number> {
  return projects.reduce(
    (acc, p) => ({ ...acc, [p.category]: (acc[p.category] ?? 0) + 1 }),
    {} as Record<CategorySlug, number>
  );
}
