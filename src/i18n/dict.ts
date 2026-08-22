import type { Locale } from "@/data/projects";

export const locales: Locale[] = ["en", "tr"];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export const dict = {
  en: {
    nav: {
      work: "Work",
      studio: "Studio",
      process: "Process",
      contact: "Contact",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      eyebrow: "Product studio · Istanbul",
      title1: "We build",
      title2: "products that ship.",
      sub: "iOS apps on the App Store, web platforms taking live payments, trading systems validated walk-forward, and AI agents that produce actual work. Five disciplines, one studio.",
      ctaPrimary: "See the work",
      ctaSecondary: "Start a project",
      scroll: "Scroll to explore",
      hint: "Drag or use ← → to switch discipline",
    },
    stats: {
      projects: "Products built",
      live: "Live in production",
      disciplines: "Disciplines",
      years: "Shipping since",
    },
    categories: {
      title: "Five disciplines",
      sub: "Pick a discipline. The scene follows you.",
      viewAll: "View all projects",
      projectsIn: "projects in this discipline",
    },
    work: {
      title: "Selected work",
      sub: "Every product below exists. Nothing here is a concept render.",
      all: "All",
      empty: "No projects in this filter yet.",
      backToWork: "Back to work",
      nextProject: "Next project",
      overview: "Overview",
      highlights: "What matters",
      stack: "Built with",
      client: "Client",
      confidential: "Client name withheld under confidentiality.",
      appStore: "Download on the App Store",
      visitSite: "Visit the live site",
      status: "Status",
      year: "Year",
      discipline: "Discipline",
    },
    process: {
      title: "How a product gets made here",
      sub: "The same four gates, whether it is an iOS app or a supply chain tool.",
      steps: [
        {
          n: "01",
          t: "Research before pixels",
          d: "Market, competitor teardown and the one job the product is hired for. If the brief is thin, we ask six questions instead of guessing.",
        },
        {
          n: "02",
          t: "System before screens",
          d: "Design tokens, component matrix and motion grammar are locked first. That is why the tenth screen looks like it belongs to the first.",
        },
        {
          n: "03",
          t: "Build with evidence",
          d: "Nothing advances without a proof: a green test run, a validated backtest window, a reproduced figure. No step is marked done on a feeling.",
        },
        {
          n: "04",
          t: "Ship, then measure",
          d: "Accessibility, Core Web Vitals, store submission, analytics. Polish belongs to v1.1 — the launch belongs to today.",
        },
      ],
    },
    faq: {
      title1: "Frequently",
      title2: "asked",
      items: [
        {
          q: "What does Corvus Tech actually do?",
          a: "We design and build digital products end to end: native iOS apps, web platforms with payments and auth, trading and finance systems, AI agent infrastructure, and internal tooling for large operations. Design, engineering and delivery come from the same place.",
        },
        {
          q: "Is this a studio or one person?",
          a: "A small studio with a heavily automated pipeline. A defined system runs discovery, design, build and validation, which is why the portfolio is larger than the headcount suggests.",
        },
        {
          q: "Can you take a project from idea to the App Store?",
          a: "Yes, including the unglamorous half: developer account setup, screenshots, privacy nutrition labels, in-app purchase configuration and review submission. Apps in this portfolio are live on the App Store under our own account.",
        },
        {
          q: "Do you work with existing codebases?",
          a: "Yes. Audit first — architecture, dependencies, test coverage and the actual risk list — then a plan with the affected files named before anything is touched.",
        },
        {
          q: "What about confidential client work?",
          a: "Enterprise projects appear here as method and measured result only. Client names, volumes and commercial terms stay out of the portfolio, permanently.",
        },
        {
          q: "How do trading projects get validated?",
          a: "Walk-forward windows, not a single flattering backtest. Drawdowns are published next to returns, and strategies that fail validation are documented as failures rather than quietly dropped.",
        },
        {
          q: "Which technologies do you use?",
          a: "SwiftUI and Swift 6 on iOS; Next.js, TypeScript and Supabase on web; Python for data, trading and automation; and Claude-based agent systems for multi-agent workflows.",
        },
        {
          q: "How do we start?",
          a: "Send the problem, not the spec. One conversation is usually enough to tell you whether this is a two-week tool or a two-month product — and whether we are the right studio for it.",
        },
      ],
    },
    contact: {
      title1: "Have something",
      title2: "worth building?",
      sub: "Tell us the problem in a paragraph. You will get a straight answer about scope, timeline and whether it is worth doing at all.",
      cta: "Write to us",
      email: "Email",
      based: "Based in Istanbul, working with clients anywhere.",
    },
    footer: {
      rights: "All rights reserved.",
      built: "Built by the studio, in public.",
      disciplines: "Disciplines",
      studio: "Studio",
    },
  },
  tr: {
    nav: {
      work: "İşler",
      studio: "Stüdyo",
      process: "Süreç",
      contact: "İletişim",
      menu: "Menü",
      close: "Kapat",
    },
    hero: {
      eyebrow: "Ürün stüdyosu · İstanbul",
      title1: "Yayına çıkan",
      title2: "ürünler kuruyoruz.",
      sub: "App Store'da iOS uygulamaları, canlı ödeme alan web platformları, walk-forward doğrulanmış trading sistemleri ve gerçekten iş üreten AI ajanları. Beş disiplin, tek stüdyo.",
      ctaPrimary: "İşleri gör",
      ctaSecondary: "Proje başlat",
      scroll: "Keşfetmek için kaydır",
      hint: "Sürükle ya da ← → ile disiplin değiştir",
    },
    stats: {
      projects: "Kurulan ürün",
      live: "Canlıda",
      disciplines: "Disiplin",
      years: "Şu tarihten beri",
    },
    categories: {
      title: "Beş disiplin",
      sub: "Bir disiplin seç. Sahne seni takip etsin.",
      viewAll: "Tüm projeleri gör",
      projectsIn: "proje bu disiplinde",
    },
    work: {
      title: "Seçilmiş işler",
      sub: "Aşağıdaki her ürün gerçekten var. Hiçbiri konsept render değil.",
      all: "Tümü",
      empty: "Bu filtrede henüz proje yok.",
      backToWork: "İşlere dön",
      nextProject: "Sonraki proje",
      overview: "Genel bakış",
      highlights: "Önemli olan",
      stack: "Kullanılan teknoloji",
      client: "Müşteri",
      confidential: "Müşteri adı gizlilik gereği paylaşılmıyor.",
      appStore: "App Store'dan indir",
      visitSite: "Canlı siteyi gör",
      status: "Durum",
      year: "Yıl",
      discipline: "Disiplin",
    },
    process: {
      title: "Burada bir ürün nasıl doğuyor",
      sub: "İster iOS uygulaması olsun ister tedarik zinciri aracı — aynı dört kapı.",
      steps: [
        {
          n: "01",
          t: "Pikselden önce araştırma",
          d: "Pazar, rakip incelemesi ve ürünün işe alındığı tek görev. Brief zayıfsa tahmin etmek yerine altı soru sorarız.",
        },
        {
          n: "02",
          t: "Ekrandan önce sistem",
          d: "Önce tasarım token'ları, bileşen matrisi ve hareket dili sabitlenir. Onuncu ekranın birinciye ait görünmesinin sebebi bu.",
        },
        {
          n: "03",
          t: "Kanıtla geliştirme",
          d: "Kanıt olmadan hiçbir adım ilerlemez: yeşil test koşumu, doğrulanmış backtest penceresi, yeniden üretilmiş bir rakam. Hiçbir iş 'his' ile bitti sayılmaz.",
        },
        {
          n: "04",
          t: "Yayınla, sonra ölç",
          d: "Erişilebilirlik, Core Web Vitals, mağaza gönderimi, analitik. Cila v1.1'in işi — yayın bugünün.",
        },
      ],
    },
    faq: {
      title1: "Sık sorulan",
      title2: "sorular",
      items: [
        {
          q: "Corvus Tech tam olarak ne yapıyor?",
          a: "Dijital ürünleri uçtan uca tasarlayıp geliştiriyoruz: native iOS uygulamaları, ödeme ve auth içeren web platformları, trading ve finans sistemleri, AI ajan altyapıları ve büyük operasyonlar için iç araçlar. Tasarım, mühendislik ve teslim aynı yerden çıkıyor.",
        },
        {
          q: "Bu bir stüdyo mu, tek kişi mi?",
          a: "Ağır otomasyonlu bir hattı olan küçük bir stüdyo. Keşif, tasarım, geliştirme ve doğrulamayı tanımlı bir sistem yürütüyor; portfolyonun kişi sayısından büyük olmasının sebebi bu.",
        },
        {
          q: "Fikirden App Store'a kadar götürebiliyor musunuz?",
          a: "Evet, işin cazibesiz yarısı dâhil: geliştirici hesabı kurulumu, ekran görüntüleri, gizlilik etiketleri, uygulama içi satın alma yapılandırması ve inceleme gönderimi. Buradaki uygulamalar kendi hesabımız altında App Store'da yayında.",
        },
        {
          q: "Mevcut bir kod tabanıyla çalışır mısınız?",
          a: "Evet. Önce denetim — mimari, bağımlılıklar, test kapsamı ve gerçek risk listesi — sonra hiçbir şeye dokunmadan önce etkilenecek dosyaların isimleriyle bir plan.",
        },
        {
          q: "Gizli müşteri işleri ne oluyor?",
          a: "Kurumsal projeler burada yalnızca yöntem ve ölçülmüş sonuç olarak yer alır. Müşteri isimleri, hacimler ve ticari şartlar portfolyoya kalıcı olarak girmez.",
        },
        {
          q: "Trading projeleri nasıl doğrulanıyor?",
          a: "Tek bir gurur okşayıcı backtest değil, walk-forward pencereleri. Düşüşler getirilerin yanında yayınlanır; doğrulamadan geçemeyen stratejiler sessizce silinmez, başarısızlık olarak belgelenir.",
        },
        {
          q: "Hangi teknolojileri kullanıyorsunuz?",
          a: "iOS'ta SwiftUI ve Swift 6; web'de Next.js, TypeScript ve Supabase; veri, trading ve otomasyonda Python; çok-ajanlı akışlarda Claude tabanlı ajan sistemleri.",
        },
        {
          q: "Nasıl başlıyoruz?",
          a: "Şartnameyi değil, problemi gönderin. Bunun iki haftalık bir araç mı yoksa iki aylık bir ürün mü olduğunu — ve doğru stüdyo olup olmadığımızı — genelde tek konuşma söyler.",
        },
      ],
    },
    contact: {
      title1: "Kurulmaya değer",
      title2: "bir şey mi var?",
      sub: "Problemi bir paragrafta anlatın. Kapsam, süre ve hatta yapmaya değip değmediği konusunda dürüst bir cevap alacaksınız.",
      cta: "Bize yazın",
      email: "E-posta",
      based: "İstanbul merkezli, her yerden müşteriyle çalışıyoruz.",
    },
    footer: {
      rights: "Tüm hakları saklıdır.",
      built: "Stüdyo tarafından, açıkta kuruldu.",
      disciplines: "Disiplinler",
      studio: "Stüdyo",
    },
  },
} as const;

export type Dict = (typeof dict)["en"];

export function getDict(locale: Locale): Dict {
  return dict[locale] as Dict;
}
