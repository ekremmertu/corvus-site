"use client";

import dynamic from "next/dynamic";
import { useScene } from "./SceneProvider";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

/**
 * Fixed 3D backdrop. Every section scrolls over one continuous scene.
 * Falls back to a pure-CSS ambient field when WebGL, motion preference or
 * device class says 3D is the wrong call.
 */
export default function SceneLayer() {
  const { enabled3d } = useScene();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="halo" />
      {enabled3d ? (
        <SceneCanvas />
      ) : (
        <div className="absolute inset-0">
          <div
            className="absolute left-1/2 top-[58%] h-[86vmin] w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[80px] transition-colors duration-700"
            style={{ background: "var(--c-live)", filter: "blur(80px)", opacity: 0.16 }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[38vh] transition-colors duration-700"
            style={{
              background:
                "linear-gradient(to top, var(--c-live-soft), transparent)",
            }}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_35%,#05060a_100%)]" />
    </div>
  );
}
