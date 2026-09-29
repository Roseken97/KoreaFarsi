"use client";

/* eslint-disable react-hooks/immutability -- three.js's scene graph (camera, mesh transforms) is
   mutated in place every frame by design; that's the standard react-three-fiber pattern, not a bug. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const PALETTE = ["#4f8a87", "#de8b89", "#9db5a5", "#3d716e", "#f8e3e1"];
const KINDS = ["icosahedron", "octahedron", "torus"] as const;

type ShapeDef = {
  kind: (typeof KINDS)[number];
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
};

function makeShapes(count: number): ShapeDef[] {
  return Array.from({ length: count }, (_, i) => ({
    kind: KINDS[i % KINDS.length],
    position: [(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 22 - 2, (Math.random() - 0.5) * 5 - 4],
    scale: 0.5 + Math.random() * 0.7,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    speed: 0.3 + Math.random() * 0.45,
  }));
}

function Shape({ def, reduceMotion }: { def: ShapeDef; reduceMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current || reduceMotion) return;
    ref.current.rotation.x += delta * def.speed * 0.18;
    ref.current.rotation.y += delta * def.speed * 0.26;
  });
  return (
    <Float speed={reduceMotion ? 0 : def.speed} rotationIntensity={reduceMotion ? 0 : 0.35} floatIntensity={reduceMotion ? 0 : 1.3}>
      <mesh ref={ref} position={def.position} scale={def.scale}>
        {def.kind === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {def.kind === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {def.kind === "torus" && <torusGeometry args={[0.8, 0.28, 8, 24]} />}
        <meshStandardMaterial
          color={def.color}
          emissive={def.color}
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.05}
          transparent
          opacity={0.72}
        />
      </mesh>
    </Float>
  );
}

/** Camera drifts gently with the pointer/scroll — tracked via window listeners so it still works while the canvas sits behind foreground content (pointer-events: none). */
function Rig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0, scroll: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
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
    const { x, y, scroll } = target.current;
    camera.position.x += (x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-y * 0.8 - scroll * 0.0025 - camera.position.y) * 0.03;
    camera.lookAt(0, -scroll * 0.0025, 0);
  });

  return null;
}

/** Full-page WebGL backdrop: soft brand-colored shapes drifting in real 3D space behind the marketing content. */
export function Scene3DBackground() {
  const shapes = useMemo(() => makeShapes(9), []);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 9], fov: 50 }}
      >
        <color attach="background" args={["#faf6ef"]} />
        <fog attach="fog" args={["#faf6ef", 6, 14]} />
        <ambientLight intensity={0.85} />
        <pointLight position={[6, 6, 8]} intensity={28} color="#ffffff" />
        <pointLight position={[-6, -4, 4]} intensity={14} color="#de8b89" />
        <Rig />
        {shapes.map((def, i) => (
          <Shape key={i} def={def} reduceMotion={reduceMotion} />
        ))}
        {!reduceMotion && <Sparkles count={18} scale={[14, 18, 7]} size={2} speed={0.2} color="#ffffff" opacity={0.35} />}
      </Canvas>
    </div>
  );
}
