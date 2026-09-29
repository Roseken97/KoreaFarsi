"use client";

/* eslint-disable react-hooks/immutability -- three.js's scene graph (camera, mesh transforms) is
   mutated in place every frame by design; that's the standard react-three-fiber pattern, not a bug. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { NodeLattice } from "./NodeLattice";

/**
 * Camera reacts to the pointer like a scrub control: position follows the cursor closely,
 * and a fast horizontal flick adds an extra decaying kick — tracked via window listeners so
 * it still works while the canvas sits behind foreground content (pointer-events: none).
 */
function Rig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, scroll: 0, kick: 0, lastX: 0, lastT: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const now = performance.now();
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dt = now - target.current.lastT;
      if (dt > 0 && target.current.lastT > 0) {
        const vx = (nx - target.current.lastX) / (dt / 16.7);
        target.current.kick = Math.max(-1, Math.min(1, target.current.kick + vx * 0.6));
      }
      target.current.x = nx;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.lastX = nx;
      target.current.lastT = now;
    }
    function onScroll() {
      target.current.scroll = window.scrollY;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame(() => {
    const state = target.current;
    state.kick *= 0.9;
    const targetX = state.x * 2.6 + state.kick * 1.4;
    const targetY = -state.y * 1.8 - state.scroll * 0.003;
    camera.position.x += (targetX - camera.position.x) * 0.09;
    camera.position.y += (targetY - camera.position.y) * 0.09;
    camera.lookAt(0, -state.scroll * 0.003, 0);
    camera.rotation.z += (state.kick * 0.05 - camera.rotation.z) * 0.09;
  });

  return null;
}

/** Hero-only WebGL backdrop: a node-lattice drifting in real 3D space, confined to whatever section it's mounted in (not the whole page). */
export function Scene3DBackground() {
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
      >
        <color attach="background" args={["#faf6ef"]} />
        <fog attach="fog" args={["#faf6ef", 10, 20]} />
        <ambientLight intensity={0.85} />
        <pointLight position={[6, 6, 8]} intensity={28} color="#ffffff" />
        <pointLight position={[-6, -4, 4]} intensity={14} color="#de8b89" />
        <Rig />
        <NodeLattice reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
