#!/usr/bin/env node
/**
 * IndexNow — Bing/Yandex'e (ChatGPT araması Bing dizinini kullanır) site haritasındaki adresleri bildirir. Ücretsiz.
 * Anahtar dosyası public/<KEY>.txt — IndexNow tasarımı gereği HERKESE AÇIK (gizli değil).
 * Koşum (yayından SONRA): node scripts/indexnow.mjs   — yeni/değişen sayfa olunca tekrar koş.
 */
const HOST = "corvus-tech.co";
const KEY = "47b710c400e14ffa8c533cdeae452312";
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} adres gönderildi → HTTP ${res.status} ${await res.text()}`);
