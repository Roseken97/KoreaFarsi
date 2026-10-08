/**
 * Site guide: one petal flies from section to section and "wakes" each one.
 *
 * Elements opt in with `data-guide="<name>"` and `data-guide-at`:
 *   start-top  – just outside the element's start-side top corner
 *   center-top – just above the element's top edge, centred
 *   orbit      – circles the element (used for the sticky phone)
 * When the petal reaches an element, the controller sets `data-guided` on it
 * once, and CSS in homepage.module.css plays that element's animation.
 *
 * The controller works without WebGL: the petal is then invisible but the
 * stops still trigger, so no section waits forever.
 */

export const guide = { x: -200, y: -200, size: 52, alive: false };

type Stop = { el: HTMLElement; x: number; y: number };

const REACH_PX = 70;
// a section the petal never reaches (fast scroll, nav jump) still plays after this long in view
const FALLBACK_MS = 1400;

function anchorOf(el: HTMLElement, rtl: boolean, vw: number, vh: number, scroll: number): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const at = el.dataset.guideAt ?? "start-top";
  const startX = rtl ? r.right + 12 : r.left - 12;
  if (at === "orbit") {
    const a = (scroll / vh) * 2.2;
    return { x: r.left + r.width / 2 + Math.cos(a) * (r.width / 2 + 46), y: r.top + r.height / 2 + Math.sin(a) * r.height * 0.32 };
  }
  if (at === "center-top") return { x: r.left + r.width / 2, y: r.top - 26 };
  return { x: Math.min(vw - 18, Math.max(18, startX)), y: r.top - 10 };
}

export function startGuide(reduced: boolean) {
  const root = document.documentElement;
  root.dataset.guideOn = "";
  guide.alive = true;
  let raf = 0;
  let last = performance.now();
  let cx = -200;
  let cy = -200;
  const seen = new WeakMap<HTMLElement, number>();

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rtl = root.dir === "rtl";
    const scroll = window.scrollY;
    guide.size = vw < 768 ? 36 : 52;

    const stops: Stop[] = Array.from(document.querySelectorAll<HTMLElement>("[data-guide]")).map((el) => ({ el, ...anchorOf(el, rtl, vw, vh, scroll) }));
    const inView = stops.filter((s) => s.y > vh * 0.08 && s.y < vh * 0.88);
    const focus = 0.42 * vh;
    let target: { x: number; y: number };
    if (inView.length) {
      target = inView.reduce((a, b) => (Math.abs(b.y - focus) < Math.abs(a.y - focus) ? b : a));
    } else {
      const edge = rtl ? vw - 40 : 40;
      // above every stop (hero): wait above the screen; past every stop: fall out below
      const past = stops.length > 0 && stops.every((s) => s.y < vh * 0.08);
      target = { x: past ? cx : edge, y: past ? vh + 120 : -120 };
    }
    if (cx < -150) {
      cx = target.x;
      cy = -120;
    }
    const k = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
    cx += (target.x - cx) * k;
    cy += (target.y - cy) * k;
    guide.x = cx;
    guide.y = cy;

    for (const s of stops) {
      if (s.el.dataset.guided !== undefined) continue;
      const r = s.el.getBoundingClientRect();
      const visible = r.top < vh * 0.85 && r.bottom > vh * 0.15;
      if (!visible) {
        seen.delete(s.el);
        continue;
      }
      if (!seen.has(s.el)) seen.set(s.el, now);
      const near = Math.hypot(s.x - cx, s.y - cy) < REACH_PX;
      if (near || reduced || now - seen.get(s.el)! > FALLBACK_MS) s.el.dataset.guided = "";
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    guide.alive = false;
  };
}
