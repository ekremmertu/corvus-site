"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { categories } from "@/data/projects";
import { DisciplineObject } from "./objects";
import { useScene } from "./SceneProvider";

const COUNT = categories.length;
const SPACING = 3.6;
/** The carousel sits right of centre so the headline keeps the left column. */
const CAROUSEL_X = 2.1;

/** Shortest signed distance between two indices on a ring. */
function ringOffset(index: number, active: number) {
  let d = index - active;
  if (d > COUNT / 2) d -= COUNT;
  if (d < -COUNT / 2) d += COUNT;
  return d;
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

function DisciplineRig({ index }: { index: number }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { active, stageRef, stopRef, exitRef } = useScene();
  const category = categories[index];

  const offset = ringOffset(index, active);
  const isActive = offset === 0;

  useFrame((_, delta) => {
    const g = group.current;
    const s = spin.current;
    if (!g || !s) return;

    const dt = Math.min(delta, 0.05);
    const stage = stageRef.current; // 0 → carousel, 1 → pinned stage
    const stop = stopRef.current;

    // ── Carousel pose (hero) ──────────────────────────────────
    // Sits below the headline so copy and object never fight for the same pixels.
    const carouselX = CAROUSEL_X + offset * SPACING;
    const carouselZ = -Math.abs(offset) * 3.4;
    const carouselY = -1.1 - Math.abs(offset) * 0.18;
    const carouselScale = Math.max(0.34, 1 - Math.abs(offset) * 0.2);

    // ── Pinned pose (discipline stage) ────────────────────────
    // The focused object comes forward and holds the frame; the rest leave.
    const stageX = isActive ? 1.9 : CAROUSEL_X + offset * SPACING * 2.4;
    const stageZ = isActive ? 1.1 : -14;
    const stageScale = isActive ? 1.02 : 0.2;

    // ── Exit: the object clears the frame for the content sections ──
    const exit = exitRef.current;

    const targetX = THREE.MathUtils.lerp(carouselX, stageX, stage);
    const targetY = THREE.MathUtils.lerp(carouselY, -0.1, stage) + exit * 9;
    const targetZ = THREE.MathUtils.lerp(carouselZ, stageZ, stage) - exit * 8;
    const targetScale =
      THREE.MathUtils.lerp(carouselScale, stageScale, stage) * (1 - exit * 0.9);

    g.position.x = damp(g.position.x, targetX, 4.2, dt);
    g.position.y = damp(g.position.y, targetY, 4.2, dt);
    g.position.z = damp(g.position.z, targetZ, 4.2, dt);
    const sc = damp(g.scale.x, targetScale, 4.2, dt);
    g.scale.setScalar(sc);

    // ── Rotation: scroll turns the object ~24° per content stop, so the
    //    front face stays readable instead of showing its back. ──
    const carouselRotY = offset * -0.42;
    const stageRotY = -0.34 + stop * 0.42;
    const targetRotY = THREE.MathUtils.lerp(carouselRotY, stageRotY, stage);
    s.rotation.y = damp(s.rotation.y, targetRotY, 3.2, dt);

    // Idle float — alive, not busy
    const t = performance.now() / 1000;
    s.position.y = Math.sin(t * 0.6 + index) * (0.08 + stage * 0.05);
    s.rotation.x = damp(
      s.rotation.x,
      Math.sin(t * 0.4 + index) * 0.06 + stage * 0.04,
      2,
      dt
    );

    g.visible = sc > 0.05;
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        <DisciplineObject
          slug={category.slug}
          accent={category.accent}
          focus={isActive ? 1 : 0}
        />
      </group>
    </group>
  );
}

function AmbientRig() {
  const key = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const { active, stageRef } = useScene();
  const color = useMemo(
    () => new THREE.Color(categories[active].accent),
    [active]
  );
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (key.current) key.current.color.lerp(color, 0.08);
    if (fill.current) fill.current.color.lerp(color, 0.08);

    // Camera eases in as the stage pins, and looks down at the carousel shelf.
    const stage = stageRef.current;
    if (key.current) {
      key.current.position.x = damp(key.current.position.x, 2.1 - stage * 0.2, 3, dt);
      key.current.position.y = damp(key.current.position.y, -0.8 + stage * 1.1, 3, dt);
    }
    camera.position.z = damp(camera.position.z, 9.4 - stage * 1.9, 3, dt);
    camera.position.y = damp(camera.position.y, -0.7 + stage * 0.85, 3, dt);
    camera.position.x = damp(camera.position.x, 1.1 - stage * 0.2, 3, dt);
    camera.lookAt(
      THREE.MathUtils.lerp(1.5, 1.4, stage),
      THREE.MathUtils.lerp(-1.05, -0.1, stage),
      0
    );
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 5, 6]} intensity={0.55} color="#dfe6ff" />
      {/* Key light sits on the selected object so the rest stay silhouettes. */}
      <pointLight ref={key} position={[0, -1.1, 3.2]} intensity={34} distance={11} />
      <pointLight
        ref={fill}
        position={[-3.5, -3.2, -1.5]}
        intensity={16}
        distance={16}
      />
    </>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 260;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.032}
        color="#9fb4ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function SceneCanvas() {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9.4], fov: 38 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <fog attach="fog" args={["#05060a", 9, 26]} />
      <AmbientRig />
      <Dust />
      {categories.map((c, i) => (
        <DisciplineRig key={c.slug} index={i} />
      ))}
    </Canvas>
  );
}
