/** Kategori adı; büyük harf başlıklarda "iOS" → "İOS", "Trading" → "TRADİNG" olmasın diye İngilizce kelimeler işaretli (★1, ★3b). */
export default function CatName({ name }: { name: string }) {
  const parts = name.split(/(iOS|Fintech|Trading)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "iOS" ? (
          <span key={i} lang="en" style={{ textTransform: "none" }}>
            iOS
          </span>
        ) : p === "Fintech" || p === "Trading" ? (
          <span key={i} lang="en">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
