"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { CategorySlug } from "@/data/projects";

interface ObjectProps {
  accent: string;
  /** 0 = far / dimmed, 1 = focused */
  focus: number;
}

const SHELL = "#0d0f17";

/**
 * Unfocused objects fall back to near-black silhouettes — only the selected
 * discipline carries its colour. Same trick the reference site uses to make
 * one item read as "chosen" without moving anything.
 */
function useMaterials(accent: string, focus: number) {
  return useMemo(() => {
    const dark = new THREE.Color("#070812");
    const accentColor = new THREE.Color(accent);

    const body = new THREE.MeshStandardMaterial({
      color: dark.clone().lerp(new THREE.Color(SHELL), 0.35 + focus * 0.65),
      metalness: 0.74,
      roughness: 0.3,
      emissive: accentColor,
      emissiveIntensity: 0.02 + focus * 0.12,
    });
    const glow = new THREE.MeshStandardMaterial({
      color: dark.clone().lerp(accentColor, 0.12 + focus * 0.88),
      metalness: 0.2,
      roughness: 0.34,
      emissive: accentColor,
      emissiveIntensity: 0.05 + focus * 1.85,
      toneMapped: false,
    });
    const edge = new THREE.MeshStandardMaterial({
      color: dark.clone().lerp(new THREE.Color("#1a1e2b"), 0.4 + focus * 0.6),
      metalness: 0.85,
      roughness: 0.24,
    });
    return { body, glow, edge };
  }, [accent, focus]);
}

/** iOS — a phone with a lit screen */
function PhoneObject({ accent, focus }: ObjectProps) {
  const m = useMaterials(accent, focus);
  return (
    <group>
      <RoundedBox args={[1.25, 2.5, 0.16]} radius={0.16} smoothness={4} material={m.body} />
      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[1.06, 2.28]} />
        <primitive object={m.glow} attach="material" />
      </mesh>
      {/* content bands on the screen */}
      {[0.72, 0.34, -0.04, -0.42].map((y, i) => (
        <mesh key={y} position={[-0.16 + i * 0.02, y, 0.09]}>
          <planeGeometry args={[0.62 - i * 0.08, 0.055]} />
          <meshBasicMaterial color="#05060a" opacity={0.55} transparent />
        </mesh>
      ))}
      <mesh position={[0, 1.12, 0.09]}>
        <capsuleGeometry args={[0.035, 0.16, 4, 8]} />
        <meshBasicMaterial color="#05060a" />
      </mesh>
    </group>
  );
}

/** Web — a browser window with a chrome bar */
function BrowserObject({ accent, focus }: ObjectProps) {
  const m = useMaterials(accent, focus);
  return (
    <group>
      <RoundedBox args={[3, 1.95, 0.14]} radius={0.1} smoothness={4} material={m.body} />
      <mesh position={[0, -0.14, 0.076]}>
        <planeGeometry args={[2.82, 1.5]} />
        <primitive object={m.glow} attach="material" />
      </mesh>
      <mesh position={[0, 0.78, 0.078]}>
        <planeGeometry args={[2.82, 0.26]} />
        <meshStandardMaterial color="#141824" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-1.28, -1.14, -1.0].map((x) => (
        <mesh key={x} position={[x, 0.78, 0.09]}>
          <circleGeometry args={[0.038, 16]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
      {/* layout blocks */}
      <mesh position={[-0.85, 0.18, 0.09]}>
        <planeGeometry args={[1.0, 0.5]} />
        <meshBasicMaterial color="#05060a" opacity={0.5} transparent />
      </mesh>
      {[0.35, 0.75, 1.15].map((x) => (
        <mesh key={x} position={[x - 0.1, 0.18, 0.09]}>
          <planeGeometry args={[0.32, 0.5]} />
          <meshBasicMaterial color="#05060a" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}

/** Fintech — a candlestick series */
function CandlesObject({ accent, focus }: ObjectProps) {
  const m = useMaterials(accent, focus);
  const candles = useMemo(
    () => [
      { x: -1.3, h: 0.9, y: -0.5, up: false },
      { x: -0.78, h: 1.35, y: -0.1, up: true },
      { x: -0.26, h: 0.7, y: 0.25, up: false },
      { x: 0.26, h: 1.6, y: 0.55, up: true },
      { x: 0.78, h: 1.0, y: 0.95, up: true },
      { x: 1.3, h: 0.8, y: 0.6, up: false },
    ],
    []
  );
  return (
    <group>
      {candles.map((c) => (
        <group key={c.x} position={[c.x, c.y - 0.3, 0]}>
          <mesh>
            <boxGeometry args={[0.3, c.h, 0.3]} />
            <primitive object={c.up ? m.glow : m.edge} attach="material" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.04, c.h + 0.5, 0.04]} />
            <primitive object={m.edge} attach="material" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[3.1, 0.03, 0.03]} />
        <primitive object={m.edge} attach="material" />
      </mesh>
    </group>
  );
}

/** AI — a core with orbiting agent nodes */
function AgentsObject({ accent, focus }: ObjectProps) {
  const m = useMaterials(accent, focus);
  const nodes = useMemo(() => {
    const count = 6;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.35;
      return {
        key: i,
        pos: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.72,
          Math.sin(angle * 2) * 0.35,
        ] as [number, number, number],
        angle,
        radius,
      };
    });
  }, []);

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <primitive object={m.glow} attach="material" />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={accent}
          wireframe
          transparent
          opacity={0.22 + focus * 0.2}
        />
      </mesh>
      {nodes.map((n) => (
        <group key={n.key}>
          <mesh position={n.pos}>
            <octahedronGeometry args={[0.2, 0]} />
            <primitive object={m.edge} attach="material" />
          </mesh>
          <mesh
            position={[n.pos[0] / 2, n.pos[1] / 2, n.pos[2] / 2]}
            rotation={[0, 0, Math.atan2(n.pos[1], n.pos[0]) - Math.PI / 2]}
          >
            <cylinderGeometry
              args={[0.012, 0.012, Math.hypot(n.pos[0], n.pos[1]), 6]}
            />
            <meshBasicMaterial color={accent} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Enterprise — a stacked pallet of shipments */
function PalletObject({ accent, focus }: ObjectProps) {
  const m = useMaterials(accent, focus);
  const boxes = useMemo(
    () => [
      { p: [-0.5, -0.55, 0], s: [0.9, 0.62, 0.9] },
      { p: [0.5, -0.55, 0], s: [0.9, 0.62, 0.9] },
      { p: [-0.5, 0.12, 0], s: [0.9, 0.62, 0.9] },
      { p: [0.5, 0.12, 0], s: [0.9, 0.62, 0.9] },
      { p: [0, 0.79, 0], s: [0.9, 0.62, 0.9] },
    ],
    []
  );
  return (
    <group>
      {boxes.map((b, i) => (
        <group key={i} position={b.p as [number, number, number]}>
          <RoundedBox
            args={b.s as [number, number, number]}
            radius={0.05}
            smoothness={3}
            material={i % 2 === 0 ? m.body : m.edge}
          />
          <mesh position={[0, 0, (b.s[2] as number) / 2 + 0.005]}>
            <planeGeometry args={[0.34, 0.16]} />
            <primitive object={m.glow} attach="material" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -1.0, 0]}>
        <boxGeometry args={[2.4, 0.16, 1.2]} />
        <primitive object={m.edge} attach="material" />
      </mesh>
    </group>
  );
}

export function DisciplineObject({
  slug,
  accent,
  focus,
}: ObjectProps & { slug: CategorySlug }) {
  switch (slug) {
    case "ios":
      return <PhoneObject accent={accent} focus={focus} />;
    case "web":
      return <BrowserObject accent={accent} focus={focus} />;
    case "fintech":
      return <CandlesObject accent={accent} focus={focus} />;
    case "ai":
      return <AgentsObject accent={accent} focus={focus} />;
    case "enterprise":
      return <PalletObject accent={accent} focus={focus} />;
  }
}
