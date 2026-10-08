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
