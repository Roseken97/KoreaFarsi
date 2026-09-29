"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const AMBER = "#d9a45c";

function makeNodes(count: number) {
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 16,
    y: (Math.random() - 0.5) * 22 - 2,
    z: (Math.random() - 0.5) * 5 - 4,
  }));
}

/** The amber node-network from the "Mainframe" reference, adapted to KoreaFarsi's light palette — replaces the floating icosahedron/octahedron/torus shapes. */
export function NodeLattice({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { pointsGeometry, lineGeometry } = useMemo(() => {
    const nodes = makeNodes(26);
    const points = new THREE.BufferGeometry();
    const flat = nodes.flatMap((n) => [n.x, n.y, n.z]);
    points.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));

    const maxDist = 5.5;
    const linePositions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < maxDist) linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
    }
    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));

    return { pointsGeometry: points, lineGeometry: lines };
  }, []);

  useFrame((state, delta) => {
    if (!group.current || reduceMotion) return;
    group.current.rotation.y += delta * 0.035;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.06;
  });

  return (
    <group ref={group}>
      <points geometry={pointsGeometry}>
        <pointsMaterial color={AMBER} size={0.16} sizeAttenuation transparent opacity={0.85} />
      </points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={AMBER} transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}
