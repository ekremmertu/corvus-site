"use client";

/** Footer'daki gizli >_ butonu — terminal easter egg'ini açar. */
export default function TerminalTrigger() {
  return (
    <button
      type="button"
      aria-label="Open Corvus terminal"
      title=">_"
      onClick={() => window.dispatchEvent(new CustomEvent("corvus:terminal"))}
      className="mono rounded border border-transparent px-1.5 py-0.5 text-[11px] text-faint transition-colors hover:border-[color:var(--c-border)] hover:text-[color:var(--c-live)]"
    >
      &gt;_
    </button>
  );
}
