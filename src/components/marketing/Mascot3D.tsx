"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * The mascot from the Hangul letter scene, rebuilt as an actual 3D character
 * (primitive geometries, no model file) instead of a flat SVG — an experiment
 * to see how a "real" 3D presence feels inside the WebGL background.
 */
export function Mascot3D({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current || reduceMotion) return;
    const t = state.clock.elapsedTime;
    group.current.position.x = Math.sin(t * 0.3) * 3.2;
    group.current.position.y = Math.cos(t * 0.45) * 1.8 + Math.sin(t * 1.6) * 0.12;
    group.current.position.z = -1 + Math.sin(t * 0.2) * 1.3;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.35;
    group.current.rotation.z = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group} scale={1.15}>
      {/* ears */}
      <mesh position={[-0.42, 0.55, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#4f8a87" roughness={0.5} />
      </mesh>
      <mesh position={[0.42, 0.55, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#4f8a87" roughness={0.5} />
      </mesh>
      <mesh position={[-0.42, 0.55, 0.13]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f8e3e1" />
      </mesh>
      <mesh position={[0.42, 0.55, 0.13]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f8e3e1" />
      </mesh>

      {/* head */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial color="#faf6ef" roughness={0.55} />
      </mesh>

      {/* cheeks */}
      <mesh position={[-0.32, -0.06, 0.5]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#de8b89" transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.32, -0.06, 0.5]} scale={[1, 1, 0.4]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#de8b89" transparent opacity={0.75} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.2, 0.06, 0.58]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial color="#16213a" />
      </mesh>
      <mesh position={[0.2, 0.06, 0.58]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial color="#16213a" />
      </mesh>
    </group>
  );
}
