/** Kategori adı; büyük harf başlıklarda "iOS" kelimesi "IOS"/"İOS" olmasın diye çeviriden muaf (★1). */
export default function CatName({ name }: { name: string }) {
  const parts = name.split(/(iOS)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "iOS" ? (
          <span key={i} lang="en" style={{ textTransform: "none" }}>
            iOS
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}
