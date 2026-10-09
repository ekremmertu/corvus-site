import type { ReactNode } from "react";

/** Tarayıcı penceresi çerçevesi — web/SaaS ekranları ve kurumsal panel için (16:10 içerik alanı). */
export default function BrowserFrame({
  url,
  children,
  className = "",
  style,
}: {
  url: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`brw ${className}`} style={style}>
      <div className="brw-bar" aria-hidden>
        <i />
        <i />
        <i />
        <span>{url}</span>
      </div>
      <div className="brw-view">{children}</div>
    </div>
  );
}
