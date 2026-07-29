import * as React from "react";
import type { ReactNode } from "react";

/**
 * React'in ViewTransition bileşeni için güvenli sarmalayıcı.
 * Canary export adı sürümler arasında değişebiliyor (ViewTransition /
 * unstable_ViewTransition); yoksa Fragment'e düşer — geçiş animasyonu
 * olmaz ama sayfa normal çalışır.
 */
type VTComponent = React.ComponentType<{ name?: string; children: ReactNode }>;

const reactAny = React as unknown as Record<string, unknown>;
const Impl: VTComponent | null =
  (reactAny.ViewTransition as VTComponent) ??
  (reactAny.unstable_ViewTransition as VTComponent) ??
  null;

export default function VT({
  name,
  children,
}: {
  name?: string;
  children: ReactNode;
}) {
  if (!Impl) return <>{children}</>;
  return <Impl name={name}>{children}</Impl>;
}
