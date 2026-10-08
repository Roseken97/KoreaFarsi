import * as THREE from "three";

/** Notched cherry-blossom petal, slightly cupped, with a deep-pink base fading to a pale tip (vertex colours). */
export function petalGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-0.34, 0.22, -0.36, 0.72, -0.12, 0.96);
  s.lineTo(0, 0.86);
  s.lineTo(0.12, 0.96);
  s.bezierCurveTo(0.36, 0.72, 0.34, 0.22, 0, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.015, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 14 });
  const pos = g.attributes.position;
  const base = new THREE.Color("#E46F92");
  const tip = new THREE.Color("#FFE4EC");
  const c = new THREE.Color();
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // cup the petal: edges and tip lift towards the viewer
    pos.setZ(i, pos.getZ(i) + x * x * 0.9 + y * y * 0.12);
    c.copy(base).lerp(tip, Math.min(1, Math.pow(y / 0.96, 0.7)));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/** Tube along a curve that tapers from `r0` at the start to `r1` at the end (a real twig, not a pipe). */
export function taperedTube(points: THREE.Vector3[], r0: number, r1: number, segments = 48) {
  const curve = new THREE.CatmullRomCurve3(points);
  const radial = 8;
  const g = new THREE.TubeGeometry(curve, segments, 1, radial, false);
  const pos = g.attributes.position;
  const centre = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    curve.getPointAt(t, centre);
    const r = r0 + (r1 - r0) * t;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(centre).multiplyScalar(r).add(centre);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  g.computeVertexNormals();
  return { geometry: g, curve };
}

/** Rounded square with a Korean glyph painted on it, used as a floating 3D tile. */
export function glyphTexture(glyph: string, fg: string, bg: string) {
  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  ctx.font = `900 ${glyph.length > 1 ? 120 : 160}px "Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(glyph, size / 2, size / 2 + 8);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
