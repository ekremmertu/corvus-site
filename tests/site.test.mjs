import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { after, before, test } from "node:test";

const PORT = 3217;
const BASE = `http://127.0.0.1:${PORT}`;
let server;

before(async () => {
  server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore", detached: true });
  const end = Date.now() + 60_000;
  while (Date.now() < end) {
    try {
      if ((await fetch(`${BASE}/en`)).ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("Server did not start");
});

after(() => {
  process.kill(-server.pid);
});

for (const [path, lang, text] of [
  ["/en", "en", "Corvus"],
  ["/tr", "tr", "Corvus"],
  ["/en/work", "en", "TripWalkers"],
  ["/tr/work", "tr", "TripWalkers"],
]) {
  test(`${path} renders in ${lang}`, async () => {
    const response = await fetch(BASE + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`));
    assert.ok(html.includes(text), `${path} should mention ${text}`);
  });
}

test("an unknown page returns 404", async () => {
  assert.equal((await fetch(`${BASE}/en/this-page-does-not-exist`)).status, 404);
});

// Fingerprints only, so this file does not publish what it protects.
test("confidential client names stay out of the repository", () => {
  const blocked = new Set([
    "6dbe2312a44d0b9025bb3bec029992f9b7f2c00bf8191259fb12c685c9cbaa3b",
    "fedb24c98f783a5d22564ae15c2ed2edcf6cc7e4e90f398414744e683f5d2629",
  ]);
  const fingerprint = (word) => createHash("sha256").update(word.toLowerCase().normalize("NFC")).digest("hex");
  const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
    encoding: "utf8",
    maxBuffer: 1 << 26,
  })
    .split("\n")
    .filter((file) => /\.(md|mdx|txt|ts|tsx|js|mjs|cjs|json|html|css|py|yml)$/i.test(file));
  const found = [];
  for (const file of files) {
    let content;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if ((content.match(/\p{L}+/gu) || []).some((word) => blocked.has(fingerprint(word)))) found.push(file);
  }
  assert.deepEqual(found, []);
});
