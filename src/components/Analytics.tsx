import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";

// Ölçüm katmanı. Vercel Analytics anahtar istemez; Clarity ve GA4 yalnızca
// ilgili ortam değişkeni tanımlıysa yüklenir, yoksa hiçbir script çıkmaz.
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      {clarityId ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
