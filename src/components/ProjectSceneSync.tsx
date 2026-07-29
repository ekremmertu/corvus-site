"use client";

import { useEffect } from "react";
import { useScene } from "@/components/scene/SceneProvider";

/**
 * A project page paints itself in its discipline's accent and pushes the
 * 3D object back so the copy owns the frame.
 */
export default function ProjectSceneSync({
  categoryIndex,
}: {
  categoryIndex: number;
}) {
  const { setActive, stageRef, exitRef } = useScene();

  useEffect(() => {
    setActive(categoryIndex);
    stageRef.current = 0;
    // Fully clear the frame — the accent halo carries the discipline colour,
    // the copy owns the pixels.
    exitRef.current = 1;
    return () => {
      exitRef.current = 0;
    };
  }, [categoryIndex, setActive, stageRef, exitRef]);

  return null;
}
