"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { petalGeometry } from "./geometry";

/* ── Scroll path ───────────────────────────────────────────────────────────
 * One cherry-blossom petal drawn in a fixed, full-screen canvas. After the
 * hero it drops in from the top and keeps fluttering in the page's side
 * margin while the page scrolls, so it reads as falling down the page and
 * never sits over the text. At the end of the page it falls out at the bottom.
 */
type Layout = { from: number; to: number; vh: number; rtl: boolean };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const CONTENT_MAX = 1200;

function measure(): Layout | null {
  const about = document.getElementById("about");
  const start = document.getElementById("start");
  if (!about || !start) return null;
  const top = (e: HTMLElement) => e.getBoundingClientRect().top + window.scrollY;
  return {
    from: top(about),
    to: top(start) + start.offsetHeight,
    vh: window.innerHeight,
    rtl: document.documentElement.dir === "rtl",
  };
}

function Petal({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const layout = useRef<Layout | null>(null);
  const cur = useRef({ x: 0, y: -0.2 });
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

  useEffect(() => {
    const update = () => (layout.current = measure());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useFrame((state, dt) => {
    const L = layout.current;
    const g = group.current;
    const m = mesh.current;
    if (!L || !g || !m) return;
    dt = Math.min(dt, 0.05);
    const s = window.scrollY;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const u = s / L.vh;

    // centre of the side margin (start side), in px from the near edge
    const w = size.width;
    const small = w < 768;
    const margin = (w - Math.min(w - 48, CONTENT_MAX)) / 2;
    const fromEdge = small ? 20 : Math.max(32, margin / 2);
    const sway = (small ? 6 : 18) * Math.sin(u * 2.1 + t * 0.6);
    const px = (L.rtl ? w - fromEdge : fromEdge) + sway;

    // drop in after the hero, flutter around a third of the way down, fall out at the end
    const enter = ease(clamp01((s - L.from * 0.55) / (L.from * 0.45)));
    const leave = ease(clamp01((s - (L.to - L.vh * 1.1)) / (L.vh * 0.9)));
    const bob = 0.07 * Math.sin(u * 1.3) + 0.02 * Math.sin(t * 0.9);
    const fy = -0.15 + enter * (0.47 + bob) + leave * 0.95;

    const k = reduced ? 1 : 1 - Math.exp(-dt * 4);
    const c = cur.current;
    c.x += (px - c.x) * k;
    c.y += (fy - c.y) * k;

    const toWorld = viewport.height / size.height;
    g.position.set((c.x - w / 2) * toWorld, (0.5 - c.y) * viewport.height, 0);
    g.scale.setScalar((small ? 34 : 52) * toWorld);

    // falling-leaf flutter: rocks side to side and tumbles slowly with the scroll
    m.rotation.set(0.9 * Math.sin(u * 1.7 + t * 1.1), u * 0.9 + t * 0.25, 0.6 * Math.sin(u * 2.3 + t * 0.8));
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
