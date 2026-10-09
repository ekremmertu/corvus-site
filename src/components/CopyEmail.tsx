"use client";

import { useState } from "react";

/** E-posta programı olmayan ziyaretçi için yedek yol: adresi panoya kopyalar. */
export default function CopyEmail({ email, label, done }: { email: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <span className="copy-row">
      <span>{email}</span>
      <button
        type="button"
        className="copy-btn"
        data-done={ok ? "1" : "0"}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setOk(true);
            setTimeout(() => setOk(false), 2200);
          } catch {
            window.prompt(label, email);
          }
        }}
      >
        <span aria-live="polite">{ok ? done : label}</span>
      </button>
    </span>
  );
}
