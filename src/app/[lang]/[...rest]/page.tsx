import { notFound } from "next/navigation";

// Dil önekli ama eşleşmeyen her adres (ör. /tr/olmayan-sayfa) temalı 404'e düşsün.
// Bu sayfa olmadan Next, [lang] düzenini atlayıp düz beyaz varsayılan 404'ü gösteriyordu.
export default function CatchAll() {
  notFound();
}
