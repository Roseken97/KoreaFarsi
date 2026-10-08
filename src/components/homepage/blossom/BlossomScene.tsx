"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { petalGeometry } from "./geometry";
import { guide } from "./guide";

/** Draws the guide petal wherever guide.ts has flown it (screen px), with a falling-leaf flutter. */
function Petal({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const prev = useRef({ x: 0, y: 0, vx: 0 });
  const { viewport, size } = useThree();
  const geometry = useMemo(() => {
    const g = petalGeometry();
    g.translate(0, -0.48, 0); // spin around the petal's middle, not its base
    return g;
  }, []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.45, emissive: new THREE.Color("#5A1630"), emissiveIntensity: 0.22 }),
    [],
  );

  useFrame((state, dt) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const toWorld = viewport.height / size.height;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const p = prev.current;
    p.vx += ((guide.x - p.x) / Math.max(dt, 0.001) - p.vx) * 0.1;
    p.x = guide.x;
    p.y = guide.y;
    const hover = reduced ? 0 : Math.sin(t * 1.4) * 6;
    g.position.set((guide.x - size.width / 2) * toWorld, -(guide.y + hover - size.height / 2) * toWorld, 0);
    g.scale.setScalar(guide.size * toWorld);
    // flutter, banking into the direction of flight
    const bank = Math.max(-0.8, Math.min(0.8, p.vx * 0.002));
    m.rotation.set(0.7 * Math.sin(t * 1.1), t * 0.5, 0.45 * Math.sin(t * 0.8) - bank);
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} geometry={geometry} material={material} />
    </group>
  );
}

export default function BlossomScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.9} color="#F4E8FF" />
      <directionalLight position={[3, 4, 6]} intensity={1.8} color="#FFF4F7" />
      <pointLight position={[-4, -2, 3]} intensity={25} color="#FF8FC7" />
      <Petal reduced={reduced} />
    </Canvas>
  );
}
