/** Gerçekçi iPhone çerçevesi — ekran görüntüsü public/shots/ altından. */
export default function Phone({
  src,
  alt,
  className = "",
  style,
  eager = false,
  view = false,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  eager?: boolean;
  view?: boolean;
}) {
  return (
    <div className={`iph ${className}`} style={style} {...(view ? { "data-view": "" } : {})}>
      <div className="iph-screen">
        <img
          src={src}
          alt={alt}
          width={640}
          height={1385}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          {...(eager ? { fetchPriority: "high" as const } : {})}
        />
      </div>
    </div>
  );
}
