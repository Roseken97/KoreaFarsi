"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { glyphTexture, petalGeometry, taperedTube } from "./geometry";

/* ── Scroll path ───────────────────────────────────────────────────────────
 * The sprig is drawn in one fixed, full-screen canvas. Its position is a
 * function of window.scrollY and the top of each homepage section, so it
 * rises out of the hero, settles beside the teacher photo, spirals around
 * the phone, then drifts side to side down the page with Korean glyph tiles.
 * x/y are viewport fractions (0,0 = top-left).
 */
type Key = { s: number; x: number; y: number; sc: number };
type Layout = { keys: Key[]; spiral: [number, number]; side: number; vh: number };

const SECTION_IDS = ["about", "app", "features", "path", "start"] as const;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const SPIRAL_TURNS = 1.25;
const SPIRAL_Y = 0.42;

function measure(): Layout | null {
  const el = Object.fromEntries(SECTION_IDS.map((id) => [id, document.getElementById(id)])) as Record<(typeof SECTION_IDS)[number], HTMLElement | null>;
  if (SECTION_IDS.some((id) => !el[id])) return null;
  const top = (e: HTMLElement) => e.getBoundingClientRect().top + window.scrollY;
  const vh = window.innerHeight;
  const rtl = document.documentElement.dir === "rtl";
  const small = window.innerWidth < 768;
  // phones have no side margins, so the sprig hugs the edge there
  const side = rtl ? (small ? 0.95 : 0.84) : small ? 0.05 : 0.16;
  // beside the teacher photo's outer top corner
  const aboutX = rtl ? (small ? 0.82 : 0.9) : small ? 0.18 : 0.1;
  const other = 1 - side;
  const about = top(el.about!);
  const app = top(el.app!);
  const appEnd = app + el.app!.offsetHeight - vh;
  const features = top(el.features!);
  const path = top(el.path!);
  const start = top(el.start!);
  const end = start + el.start!.offsetHeight;
  const spiralStart = app - vh * 0.3;
  const a0 = rtl ? 0 : Math.PI;
  const aEnd = a0 + SPIRAL_TURNS * Math.PI * 2;
  const R = side - 0.5;
  return {
    side,
    vh,
    spiral: [spiralStart, appEnd],
    keys: [
      { s: about * 0.35, x: aboutX, y: 1.35, sc: 0.7 },
      { s: about, x: aboutX, y: small ? 0.2 : 0.26, sc: 1 },
      { s: spiralStart, x: side, y: SPIRAL_Y, sc: 1 },
      { s: appEnd, x: 0.5 + Math.abs(R) * Math.cos(aEnd), y: SPIRAL_Y + 0.14 * Math.sin(aEnd), sc: 1 },
      { s: features + vh * 0.25, x: other, y: 0.34, sc: 0.85 },
      { s: path + vh * 0.25, x: side, y: 0.3, sc: 0.85 },
      { s: start + vh * 0.05, x: 0.5, y: 0.2, sc: 1.05 },
      { s: end - vh * 0.6, x: 0.5, y: 0.2, sc: 1.05 },
      { s: end, x: 0.5, y: -0.35, sc: 0.9 },
    ],
  };
}

function target(L: Layout, s: number) {
  const [sp0, sp1] = L.spiral;
  if (s > sp0 && s < sp1) {
    const p = (s - sp0) / (sp1 - sp0);
    const a = (L.side > 0.5 ? 0 : Math.PI) + p * SPIRAL_TURNS * Math.PI * 2;
    return { x: 0.5 + Math.abs(L.side - 0.5) * Math.cos(a), y: SPIRAL_Y + 0.14 * Math.sin(a), sc: 0.92 + 0.14 * Math.sin(a), spiral: p };
  }
  const k = L.keys;
  if (s <= k[0].s) return { ...k[0], spiral: 0 };
  for (let i = 1; i < k.length; i++) {
    if (s <= k[i].s) {
      const t = ease(clamp01((s - k[i - 1].s) / (k[i].s - k[i - 1].s)));
      const a = k[i - 1];
      const b = k[i];
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, sc: a.sc + (b.sc - a.sc) * t, spiral: s > sp1 ? 1 : 0 };
    }
  }
  const last = k[k.length - 1];
  return { ...last, spiral: 1 };
}

/* ── The sprig ─────────────────────────────────────────────────────────── */

const FLOWERS: { at: number; off: [number, number, number]; s: number; rot: [number, number, number] }[] = [
  { at: 0.3, off: [0.2, 0.05, 0.15], s: 0.42, rot: [0.3, 0.4, 0.2] },
  { at: 0.52, off: [-0.24, 0.1, 0.1], s: 0.5, rot: [0.1, -0.5, 1.1] },
  { at: 0.7, off: [0.22, 0.12, 0.18], s: 0.46, rot: [0.5, 0.6, -0.4] },
  { at: 0.86, off: [-0.12, 0.2, 0.22], s: 0.36, rot: [-0.2, -0.3, 0.6] },
];
const BUDS: { at: number; off: [number, number, number]; s: number }[] = [
  { at: 0.98, off: [0.04, 0.12, 0], s: 1 },
  { at: 0.42, off: [-0.14, 0.12, -0.05], s: 0.8 },
  { at: 0.62, off: [0.16, 0.16, -0.08], s: 0.75 },
];

function Flower({ petal, material, scale }: { petal: THREE.BufferGeometry; material: THREE.Material; scale: number }) {
  return (
    <group scale={scale}>
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <mesh geometry={petal} material={material} rotation={[-0.55, 0, 0]} position={[0, 0.06, 0]} />
        </group>
      ))}
      <mesh position={[0, 0, 0.06]}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#C2416B" roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, 0, a]}>
            <mesh position={[0, 0.13, 0.17]} rotation={[0.7, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.006, 0.26, 4]} />
              <meshStandardMaterial color="#F7C6D3" />
            </mesh>
            <mesh position={[0, 0.22, 0.27]}>
              <sphereGeometry args={[0.022, 8, 6]} />
              <meshStandardMaterial color="#F5C451" emissive="#B9771A" emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Sprig({ petal, petalMat }: { petal: THREE.BufferGeometry; petalMat: THREE.Material }) {
  const { main, twigs } = useMemo(() => {
    const main = taperedTube(
      [new THREE.Vector3(-0.15, -1.25, -0.1), new THREE.Vector3(0.05, -0.6, 0), new THREE.Vector3(-0.05, 0.05, 0.05), new THREE.Vector3(0.1, 0.65, 0), new THREE.Vector3(0.02, 1.15, 0.05)],
      0.07,
      0.018,
    );
    const twigs = [
      taperedTube([new THREE.Vector3(0.03, -0.45, 0), new THREE.Vector3(0.3, -0.25, 0.08), new THREE.Vector3(0.45, -0.05, 0.12)], 0.035, 0.012, 16),
      taperedTube([new THREE.Vector3(0.02, 0.2, 0.04), new THREE.Vector3(-0.28, 0.4, 0.06), new THREE.Vector3(-0.4, 0.62, 0.1)], 0.03, 0.01, 16),
    ];
    return { main, twigs };
  }, []);
  const bark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3B3566", roughness: 0.45, metalness: 0.25 }), []);
  const budMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#E46F92", roughness: 0.5, emissive: "#5A1630", emissiveIntensity: 0.25 }), []);
  const tips = [twigs[0].curve.getPointAt(1), twigs[1].curve.getPointAt(1)];

  return (
    <group>
      <mesh geometry={main.geometry} material={bark} />
      {twigs.map((t, i) => (
        <mesh key={i} geometry={t.geometry} material={bark} />
      ))}
      {FLOWERS.map((f, i) => {
        const p = main.curve.getPointAt(f.at);
        return (
          <group key={i} position={[p.x + f.off[0], p.y + f.off[1], p.z + f.off[2]]} rotation={f.rot}>
            <Flower petal={petal} material={petalMat} scale={f.s} />
          </group>
        );
      })}
      {tips.map((p, i) => (
        <group key={`t${i}`} position={p} rotation={[0.4, i ? -0.6 : 0.6, i ? 0.5 : -0.5]}>
          <Flower petal={petal} material={petalMat} scale={0.38} />
        </group>
      ))}
      {BUDS.map((b, i) => {
        const p = main.curve.getPointAt(b.at);
        return (
          <mesh key={`b${i}`} material={budMat} position={[p.x + b.off[0], p.y + b.off[1], p.z + b.off[2]]} scale={[0.07 * b.s, 0.12 * b.s, 0.07 * b.s]}>
            <sphereGeometry args={[1, 14, 12]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Drifting petals and Korean glyph tiles ────────────────────────────── */

const FALLING = 16;
const GLYPHS = [
  { g: "한", fg: "#FFE4EC", bg: "#2A2350" },
  { g: "글", fg: "#2A2350", bg: "#F8A8C0" },
  { g: "ㄱ", fg: "#2FE6E0", bg: "#2A2350" },
  { g: "ㅏ", fg: "#2A2350", bg: "#FFE4EC" },
  { g: "꽃", fg: "#FFFFFF", bg: "#AE8AD2" },
];

function FallingPetals({ petal, anchor, reduced }: { petal: THREE.BufferGeometry; anchor: React.RefObject<THREE.Group | null>; reduced: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.55, transparent: true, opacity: 0.9 }), []);
  const parts = useMemo(
    () => Array.from({ length: FALLING }, (_, i) => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), spin: new THREE.Vector3(), life: 99, max: 5 + ((i * 7) % 5) * 0.6, delay: (i / FALLING) * 6 })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const home = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const mesh = ref.current;
    const a = anchor.current;
    if (!mesh || !a) return;
    dt = Math.min(dt, 0.05);
    a.getWorldPosition(home);
    const sc = a.scale.x;
    parts.forEach((q, i) => {
      if (q.delay > 0) {
        q.delay -= dt;
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        return;
      }
      q.life += reduced ? 0 : dt;
      if (q.life > q.max) {
        q.life = 0;
        q.p.set(home.x + (Math.random() - 0.5) * 1.2 * sc, home.y + (Math.random() * 0.8 + 0.1) * sc, home.z + (Math.random() - 0.5) * 0.6);
        q.v.set((Math.random() - 0.5) * 0.25, -0.25 - Math.random() * 0.25, 0);
        q.spin.set(Math.random() * 2, Math.random() * 2, Math.random());
      }
      q.p.addScaledVector(q.v, dt);
      q.p.x += Math.sin(state.clock.elapsedTime * 1.3 + i) * dt * 0.2;
      q.r.set(q.r.x + q.spin.x * dt, q.r.y + q.spin.y * dt, q.r.z + q.spin.z * dt);
      const fade = Math.min(1, q.life / 0.6, (q.max - q.life) / 1.2);
      dummy.position.copy(q.p);
      dummy.rotation.copy(q.r);
      dummy.scale.setScalar(0.11 * sc * Math.max(0, fade));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={ref} args={[petal, mat, FALLING]} frustumCulled={false} />;
}

function GlyphTiles({ show, reduced }: { show: React.RefObject<number>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const tiles = useMemo(
    () =>
      GLYPHS.map((g) => {
        const tex = glyphTexture(g.g, g.fg, g.bg);
        return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.1 });
      }),
    [],
  );
  const edge = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1E1838", roughness: 0.4 }), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const k = show.current ?? 0;
    const t = state.clock.elapsedTime;
    g.visible = k > 0.01;
    g.children.forEach((c, i) => {
      const a = (i / GLYPHS.length) * Math.PI * 2 + (reduced ? 0 : t * 0.35);
      c.position.set(Math.cos(a) * 1.7, Math.sin(a * 1.3 + i) * 0.6, Math.sin(a) * 0.8);
      if (!reduced) c.rotation.set(Math.sin(t * 0.6 + i) * 0.4, c.rotation.y + dt * 0.6, Math.sin(t * 0.4 + i) * 0.2);
      c.scale.setScalar(0.5 * k);
    });
  });

  return (
    <group ref={group}>
      {tiles.map((m, i) => (
        <mesh key={i} material={[edge, edge, edge, edge, m, m]}>
          <boxGeometry args={[1, 1, 0.22]} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Rig: follows the scroll path with damping ────────────────────────── */

function Rig({ reduced }: { reduced: boolean }) {
  const anchor = useRef<THREE.Group>(null);
  const sprig = useRef<THREE.Group>(null);
  const layout = useRef<Layout | null>(null);
  const glyphs = useRef(0);
  const cur = useRef({ x: 0.84, y: 1.4, sc: 0.7, spin: 0, lastS: 0, vel: 0 });
  const { viewport, size } = useThree();
  const petal = useMemo(() => petalGeometry(), []);
  const petalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.5, emissive: new THREE.Color("#5A1630"), emissiveIntensity: 0.18 }),
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
    const a = anchor.current;
    const s = sprig.current;
    if (!L || !a || !s) return;
    dt = Math.min(dt, 0.05);
    const y = window.scrollY;
    const tg = target(L, y);
    const c = cur.current;
    const k = reduced ? 1 : 1 - Math.exp(-dt * 5);
    c.x += (tg.x - c.x) * k;
    c.y += (tg.y - c.y) * k;
    c.sc += (tg.sc - c.sc) * k;
    c.vel += ((y - c.lastS) / Math.max(dt, 0.001) / L.vh - c.vel) * 0.1;
    c.lastS = y;

    const small = size.width < 768;
    const base = (viewport.height / 2.6) * (small ? 0.5 : 0.9);
    a.position.set((c.x - 0.5) * viewport.width, (0.5 - c.y) * viewport.height, 0);
    a.scale.setScalar(base * 0.5 * c.sc);

    const t = state.clock.elapsedTime;
    s.rotation.y = y * 0.0022 + (reduced ? 0 : Math.sin(t * 0.5) * 0.25) + tg.spiral * Math.PI * 2;
    s.rotation.z = (reduced ? 0 : Math.sin(t * 0.7) * 0.06) - Math.max(-0.35, Math.min(0.35, c.vel * 0.12));
    s.rotation.x = reduced ? 0 : Math.sin(t * 0.4) * 0.08;

    // Korean glyph tiles join once the spiral around the phone is done
    const want = tg.spiral >= 1 ? 1 : 0;
    glyphs.current += (want - glyphs.current) * (reduced ? 1 : 1 - Math.exp(-dt * 3));
  });

  return (
    <>
      <group ref={anchor}>
        <group ref={sprig}>
          <Sprig petal={petal} petalMat={petalMat} />
        </group>
        <GlyphTiles show={glyphs} reduced={reduced} />
      </group>
      <FallingPetals petal={petal} anchor={anchor} reduced={reduced} />
    </>
  );
}

export default function BlossomScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 10], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.85} color="#F4E8FF" />
      <directionalLight position={[3, 4, 6]} intensity={1.8} color="#FFF4F7" />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#FF8FC7" />
      <pointLight position={[4, 2, -3]} intensity={20} color="#2FE6E0" />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
