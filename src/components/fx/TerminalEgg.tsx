"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { categories, type CardProject } from "@/data/taxonomy";
import { SITE } from "@/lib/site";

const TRIGGER = "corvus";

interface Line {
  kind: "in" | "out";
  text: string;
}

/**
 * Easter egg: sayfada "corvus" yazınca (veya footer'daki >_ ile) açılan
 * mini terminal. Corvus Tech Terminal ürününe selam.
 * Aç: klavye "corvus" · window event "corvus:terminal" — Kapat: ESC / exit
 */
export default function TerminalEgg({ entries }: { entries: CardProject[] }) {
  // Yalniz perdesiz projeler gelir — gizli isler terminalden de listelenmez.
  const projects = entries;
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const buffer = useRef("");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/tr") ? "tr" : "en";

  const boot = useCallback(() => {
    setLines([
      { kind: "out", text: "CORVUS TECH TERMINAL — guest shell" },
      { kind: "out", text: 'type "help" for commands · "exit" to close' },
    ]);
    setOpen(true);
  }, []);

  // Klavye tetikleyici + harici event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /input|textarea|select/i.test(t.tagName)) return;
      if (open) return;
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer.current === TRIGGER) boot();
    };
    const onOpen = () => boot();
    window.addEventListener("keydown", onKey);
    window.addEventListener("corvus:terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("corvus:terminal", onOpen);
    };
  }, [open, boot]);

  // Açıkken: ESC + focus
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    const put = (...texts: string[]) =>
      setLines((l) => [
        ...l,
        { kind: "in" as const, text: cmd },
        ...texts.map((text) => ({ kind: "out" as const, text })),
      ]);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);

    switch (name) {
      case "help":
        put(
          "help              this list",
          "ls                disciplines",
          `ls projects       all ${entries.length} projects`,
          "open <slug>       open a project page",
          "whoami            who is corvus",
          "contact           say hello",
          "clear             clear screen",
          "exit              close terminal"
        );
        break;
      case "ls":
        if (args[0] === "projects") {
          put(...projects.map((p) => `${p.slug.padEnd(28)} ${p.category}`));
        } else {
          put(...categories.map((c) => `${c.slug.padEnd(12)} ${c.name[locale as "en" | "tr"]}`));
        }
        break;
      case "open": {
        const slug = args[0];
        const proj = projects.find((p) => p.slug === slug);
        if (proj) {
          put(`opening ${slug}…`);
          setOpen(false);
          router.push(`/${locale}/work/${slug}`);
        } else {
          put(`not found: ${slug ?? ""} — try "ls projects"`);
        }
        break;
      }
      case "whoami":
        put("guest — but the studio behind this site ships real products.");
        break;
      case "contact":
        put(`${SITE.linkedinLabel} — tell us the problem, not the spec.`);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      case "sudo":
        put("nice try.");
        break;
      default:
        put(`command not found: ${name} — try "help"`);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Corvus terminal"
      className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="mono w-full max-w-[640px] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--c-border-strong)] bg-[#04050a] shadow-[var(--shadow-lg)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--c-border)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] uppercase tracking-[0.18em] text-faint">
            corvus — guest
          </span>
        </div>
        <div ref={bodyRef} className="max-h-[46vh] overflow-y-auto px-4 py-3 text-[13px] leading-relaxed">
          {lines.map((l, i) => (
            <p key={i} className={l.kind === "in" ? "text-ink" : "text-dim"}>
              {l.kind === "in" ? (
                <>
                  <span style={{ color: "var(--c-live)" }}>❯</span> {l.text}
                </>
              ) : (
                <span className="whitespace-pre-wrap">{l.text}</span>
              )}
            </p>
          ))}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
          >
            <span style={{ color: "var(--c-live)" }}>❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent text-[13px] text-ink outline-none"
              spellCheck={false}
              autoComplete="off"
              aria-label="terminal input"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
