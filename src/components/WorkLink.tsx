import Link from "next/link";
import type { ComponentProps } from "react";

// Kendi menüsü ve hareket dili olan bağımsız statik sayfalar (next.config.ts rewrites ile aynı liste).
// Next istemci geçişi bunları RSC olarak çekmeye çalışıp 404 gösterir → düz <a> ile tam sayfa yüklenir.
const STANDALONE = new Set([
  "/en/work/tripwalkers", "/tr/work/tripwalkers",
  "/en/work/blokbom", "/tr/work/blokbom",
  "/en/work/lingoria", "/tr/work/lingoria",
]);

type Props = ComponentProps<typeof Link> & { href: string };

export default function WorkLink({ href, ...rest }: Props) {
  if (STANDALONE.has(href)) return <a href={href} {...(rest as ComponentProps<"a">)} />;
  return <Link href={href} {...rest} />;
}
