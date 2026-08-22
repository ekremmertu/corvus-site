"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { categories } from "@/data/taxonomy";

interface SceneState {
  /** Active discipline index (0-4) */
  active: number;
  setActive: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** 0 → hero, 1 → discipline stage fully pinned. Read inside rAF, never a render trigger. */
  stageRef: RefObject<number>;
  /** Index of the visible content stop (0-3) inside the pinned stage. */
  stopRef: RefObject<number>;
  /** 0 → object holds the frame, 1 → object has left for the content sections. */
  exitRef: RefObject<number>;
  enabled3d: boolean;
}

const SceneContext = createContext<SceneState | null>(null);

export function useScene() {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene must be used inside <SceneProvider>");
  return ctx;
}

export function SceneProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState(0);
  const [enabled3d, setEnabled3d] = useState(false);
  const stageRef = useRef(0);
  const stopRef = useRef(0);
  const exitRef = useRef(0);

  // Progressive enhancement: 3D only where it does not hurt.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarseSmall = window.matchMedia("(max-width: 767px)").matches;
    const lowCores =
      typeof navigator !== "undefined" &&
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 4;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      webgl = false;
    }

    setEnabled3d(webgl && !reduced && !coarseSmall && !lowCores);
  }, []);

  const setActive = useCallback((index: number) => {
    const clamped = ((index % categories.length) + categories.length) % categories.length;
    setActiveState(clamped);
  }, []);

  const next = useCallback(() => setActiveState((i) => (i + 1) % categories.length), []);
  const prev = useCallback(
    () => setActiveState((i) => (i - 1 + categories.length) % categories.length),
    []
  );

  // The active discipline paints the whole page: CSS custom properties drive
  // every halo, button and border so the DOM stays in sync with the 3D scene.
  useEffect(() => {
    const category = categories[active];
    const root = document.documentElement;
    root.style.setProperty("--c-live", category.accent);
    root.style.setProperty("--c-live-soft", category.accentSoft);
  }, [active]);

  const value = useMemo<SceneState>(
    () => ({ active, setActive, next, prev, stageRef, stopRef, exitRef, enabled3d }),
    [active, setActive, next, prev, enabled3d]
  );

  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}
