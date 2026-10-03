/* KoreaFarsi — 30s promo. One paused GSAP timeline + procedural layers; every frame is a pure function of t.
   Render: window.seek(t). Preview: open with ?t=12.3 or ?play. */
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ramp = (t, a, b) => clamp((t - a) / (b - a));
  const DUR = 30;

  // ---------- static builds ----------
  const petalsEl = $("#petals");
  // fixed pseudo-random table (no Math.random): x0, y0, speed, sway, phase, rot0, rotSpeed, scale
  const PET = [
    [90, 120, 62, 34, 0.3, 20, 22, 1.0], [260, 900, 48, 26, 1.7, -40, -18, 0.8], [430, 1500, 70, 40, 2.9, 60, 30, 1.1],
    [610, 300, 55, 30, 4.1, 10, -26, 0.9], [780, 1180, 66, 36, 5.3, -70, 20, 1.2], [960, 640, 52, 28, 0.9, 35, -14, 0.85],
    [160, 1750, 58, 30, 2.2, -15, 24, 0.75], [520, 60, 64, 38, 3.6, 80, -20, 1.0], [880, 1840, 50, 24, 4.8, -55, 16, 0.9],
    [340, 560, 60, 32, 5.9, 25, -24, 0.7], [1010, 1400, 68, 34, 1.2, -30, 28, 1.05], [700, 760, 46, 22, 3.1, 50, -12, 0.8],
  ];
  PET.forEach(() => { const d = document.createElement("div"); d.className = "petal"; petalsEl.appendChild(d); });
  const petals = $$(".petal");

  const raildots = $("#raildots");
  for (let i = 0; i < 7; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", "15"); c.setAttribute("stroke", "#4f8a87"); c.setAttribute("stroke-width", "5");
    raildots.appendChild(c);
  }
  const dots = [...raildots.children];

  const STEPS = ["یادگیری واژه", "هم‌نشینی‌ها", "تمرین جمله‌سازی", "تبدیل و خلق جمله", "نوشتن", "ماموریت گفتاری", "مرور و تمرین"];
  const FA_DIG = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];
  const stepsEl = $("#steps");
  STEPS.forEach((s, i) => { const d = document.createElement("div"); d.className = "step"; d.innerHTML = `<b>${FA_DIG[i]}</b>${s}`; stepsEl.appendChild(d); });
  const stepRows = $$(".step");

  const daysEl = $("#days");
  FA_DIG.forEach((n) => { const d = document.createElement("div"); d.className = "d"; d.innerHTML = `<small>روز</small>${n}`; daysEl.appendChild(d); });
  const dayBoxes = $$("#days .d");

  const weekEl = $("#week");
  ["ش", "ی", "د", "س", "چ", "پ", "ج"].forEach((n, i) => { const d = document.createElement("div"); d.className = "w" + (i < 4 ? " on" : ""); d.textContent = n; weekEl.appendChild(d); });

  const mkBars = (el, n) => { for (let i = 0; i < n; i++) el.appendChild(document.createElement("i")); return [...el.children]; };
  const wbars = mkBars($("#wwave"), 26);
  const mbars = mkBars($("#micwave"), 40);

  // ---------- params driven by the timeline ----------
  const arc = { x1: 820, y1: 1250, x2: 260, y2: 1250, lift: -260, draw: 0, op: 0, dot: 0, dotOp: 0 };
  const rail = { dotsOp: 0, active: 0, rowsOp: 0 };
  const fx = { petals: 0.85, wave: 0, mic: 0, typeT: 0, ans: 0, typing: 0, tasks: 0, dayHi: 0 };

  const P = (sel, x, y, extra = {}) => gsap.set(sel, { xPercent: -50, yPercent: -50, x, y, ...extra });

  function build() {
    // ---------- initial (t = 0) state ----------
    const hidden = "#s2a,#s2b,#s2pfa,#s2pko,#s3logo,#s3name,#s3latin,#s3tag,#badge,.chip,#word,#col1,#col2,.tile,#trans,#mic,#micwave,#say,#days,#later,#recall,#s9title,.step,[id^=pt],#phone,#course,.book,#endlogo,#endname,#endcta,#endurl,#endig,.ov,#arcdot";
    gsap.set(hidden, { opacity: 0 });
    P("#s1ko", 540, 860); P("#s1fa", 540, 1090);
    P("#s2a", 540 + 280, 700); P("#s2b", 540 - 280, 862);
    P("#s2pfa", 820, 1250, { scale: 0.6 }); P("#s2pko", 260, 1250, { scale: 0.6 });
    P("#s3logo", 540, 790, { scale: 0.9 }); P("#s3name", 540, 1100); P("#s3latin", 540, 1210); P("#s3tag", 540, 1322);
    $$(".chip").forEach((c) => P(c, 510, 430, { scale: 0.85 }));
    P("#word", 510, 1100, { scale: 0.92 });
    gsap.set("#wko,#wrom,#wfa,#word .rule", { opacity: 0, y: 30 });
    P("#col1", -420, 1020); P("#col2", -420, 1200);
    P("#trans", 510, 1060); P("#mic", 510, 1090, { scale: 0.5, zIndex: 3 }); P("#micwave", 510, 1090); P("#say", 510, 1400, { y: 1460 });
    P("#days", 510, 760, { y: 800 }); P("#later", 510, 905); P("#recall", 510, 1150);
    gsap.set("#check", { scale: 0, transformOrigin: "50% 50%" });
    const cp = $("#checkpath"); const cl = cp.getTotalLength(); gsap.set(cp, { strokeDasharray: cl, strokeDashoffset: cl });
    P("#s9title", 540, 430, { y: 470 });
    stepRows.forEach((r, i) => gsap.set(r, { xPercent: -100, yPercent: -50, x: 912, y: 540 + i * 150 }));
    ["#pt1", "#pt2", "#pt3", "#pt4"].forEach((s) => P(s, 540, 262, { y: 292 }));
    P("#phone", 540, 2500, { rotation: -5, scale: 1.14, zIndex: 4 });
    gsap.set(".hcard", { opacity: 0, scale: 0.85 });
    P("#course", 540, 1000, { scale: 0.3, zIndex: 6 });
    $$(".book").forEach((b) => P(b, 540, 1000, { scale: 0.3, zIndex: 6 }));
    gsap.set("#ovAI", { left: 296, top: 576, width: 228, height: 260, borderRadius: 40 });
    gsap.set("#ovPlan", { left: 44, top: 576, width: 228, height: 260, borderRadius: 40 });
    gsap.set("#ovAI > *, #ovPlan > *", { opacity: 0 });
    gsap.set("#q", { scale: 0.8, transformOrigin: "100% 100%" }); gsap.set("#ex", { y: 30 }); gsap.set("#cinput,#ovAI .sug", { y: 30 });
    P("#endlogo", 540, 900, { scale: 0.2 }); P("#endname", 540, 1040); P("#endcta", 540, 1150); P("#endurl", 540, 1300, { scale: 0.7 }); P("#endig", 540, 1440);

    // measure sentence slots after fonts are in
    const tiles = ["#t1", "#t2", "#t3"].map((s) => $(s));
    const ws = tiles.map((t) => t.offsetWidth); const gap = 18; const W = ws.reduce((a, b) => a + b) + gap * 2;
    let cx = 510 - W / 2; const slots = ws.map((w) => { const c = cx + w / 2; cx += w + gap; return c; });
    P("#t1", slots[0], 560); P("#t2", slots[1], 560); P("#t3", 510, 720, { scale: 0.6 });

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
    const to = (s, v, t) => tl.to(s, v, t);

    // S1 hook 0–2.0
    to("#s1ko", { scale: 1.05, duration: 1.5, ease: "none" }, 0);
    to("#s1ko span", { y: -12, duration: 0.7, ease: "sine.inOut", stagger: 0.12, yoyo: true, repeat: 1 }, 0);
    to("#s1fa", { scale: 1.04, duration: 1.45, ease: "none" }, 0);
    to("#s1fa", { y: 1210, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.45);
    to("#s1ko", { scale: 7, filter: "blur(14px)", duration: 0.42, ease: "power2.in" }, 1.45);
    to("#s1ko", { opacity: 0, duration: 0.2, ease: "none" }, 1.66);
    to(fx, { petals: 0.4, duration: 0.6 }, 1.6);

    // S2 premise 2.0–4.4
    to("#s2a", { x: 540, opacity: 1, duration: 0.7, ease: "expo.out" }, 1.86);
    to("#s2b", { x: 540, opacity: 1, duration: 0.7, ease: "expo.out" }, 1.98);
    to("#s2pfa", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, 2.35);
    tl.set(arc, { op: 1 }, 2.45);
    to(arc, { draw: 1, duration: 0.85, ease: "power2.inOut" }, 2.45);
    to("#s2pko", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, 3.2);
    tl.set(arc, { dotOp: 1 }, 3.3);
    to(arc, { dot: 1, duration: 0.8, ease: "power2.inOut" }, 3.3);
    to("#s2", { scale: 1.03, duration: 2.4, ease: "none" }, 2.0);
    to("#s2a,#s2b", { y: "-=190", opacity: 0, duration: 0.38, ease: "power2.in", stagger: 0.05 }, 4.05);
    to("#s2pfa,#s2pko", { opacity: 0, scale: 0.8, duration: 0.3, ease: "power2.in" }, 4.05);
    tl.set(arc, { dotOp: 0 }, 4.12);

    // S3 brand 4.4–6.6
    to(arc, { x1: 800, y1: 1410, x2: 280, y2: 1410, lift: 26, duration: 0.75, ease: "power3.inOut" }, 4.1);
    to("#s3logo", { y: 700, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" }, 4.3);
    to("#s3logo", { scale: 1.04, duration: 1.2, ease: "none" }, 5.1);
    to("#s3name", { y: 1050, opacity: 1, duration: 0.6, ease: "expo.out" }, 4.55);
    to("#s3latin", { y: 1160, opacity: 1, duration: 0.6, ease: "expo.out" }, 4.7);
    to("#s3tag", { y: 1272, opacity: 1, duration: 0.6, ease: "expo.out" }, 4.85);
    to(fx, { petals: 0.8, duration: 0.5 }, 4.4);
    to("#s3name,#s3latin,#s3tag", { y: "-=130", opacity: 0, duration: 0.36, ease: "power2.in", stagger: 0.04 }, 6.22);
    to("#s3logo", { y: 250, scale: 0.23, duration: 0.55, ease: "power3.inOut" }, 6.2);
    to(arc, { draw: 0, duration: 0.25, ease: "power2.in" }, 6.2);
    tl.set(arc, { x1: 1012, y1: 440, x2: 1012, y2: 1460, lift: 0 }, 6.47);
    to(arc, { draw: 1, duration: 0.5, ease: "power2.out" }, 6.5);
    to(fx, { petals: 0.22, duration: 0.5 }, 6.3);
    to(rail, { dotsOp: 1, duration: 0.3 }, 6.85);
    to(rail, { active: 1, duration: 0.3 }, 6.95);

    // S4 word 6.6–8.6
    to("#chip1", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }, 6.75);
    to("#word", { y: 890, opacity: 1, scale: 1, duration: 0.65, ease: "expo.out" }, 6.6);
    to("#wko,#wrom,#word .rule,#wfa", { opacity: 1, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.09 }, 6.85);
    to(fx, { wave: 1, duration: 0.3 }, 7.35);
    to("#word", { scale: 1.03, duration: 1.2, ease: "none" }, 7.3);
    to(fx, { wave: 0, duration: 0.25 }, 8.3);

    // S5 collocations 8.6–10.4
    to("#word", { y: 700, scale: 0.6, duration: 0.55, ease: "power3.inOut" }, 8.5);
    to("#chip1", { opacity: 0, y: 390, duration: 0.18, ease: "power2.in" }, 8.5);
    to("#chip2", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" }, 8.72);
    to(rail, { active: 2, duration: 0.25 }, 8.7);
    to("#col1", { x: 510, opacity: 1, duration: 0.55, ease: "expo.out" }, 8.85);
    to("#col2", { x: 510, opacity: 1, duration: 0.55, ease: "expo.out" }, 9.0);
    to("#col1,#col2", { x: 524, duration: 0.85, ease: "none" }, 9.5);

    // S6 sentence 10.4–12.4
    to("#col1,#col2", { x: 1500, duration: 0.4, ease: "power2.in", stagger: 0.05 }, 10.2);
    to("#chip2", { opacity: 0, y: 390, duration: 0.18, ease: "power2.in" }, 10.3);
    to("#chip3", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" }, 10.52);
    to(rail, { active: 3, duration: 0.25 }, 10.5);
    to("#word", { scale: 0.22, opacity: 0, y: 720, duration: 0.35, ease: "power2.in" }, 10.3);
    to("#t3", { opacity: 1, duration: 0.15 }, 10.5);
    to("#t3", { x: slots[2], y: 860, scale: 1, duration: 0.6, ease: "power3.inOut" }, 10.55);
    to("#t1", { y: 860, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, 10.6);
    to("#t2", { y: 860, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }, 10.74);
    tl.set("#trans", { opacity: 1 }, 11.2);
    to(fx, { typeT: 1, duration: 0.7, ease: "none" }, 11.2);
    to("#t1,#t2,#t3", { y: 845, duration: 1.1, ease: "none" }, 11.25);

    // S7 speaking 12.4–14.2
    to("#chip3", { opacity: 0, y: 390, duration: 0.18, ease: "power2.in" }, 12.3);
    to("#chip6", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" }, 12.52);
    to(rail, { active: 6, duration: 0.5, ease: "power1.inOut" }, 12.4);
    to("#t1,#t2,#t3", { y: 620, duration: 0.5, ease: "power3.inOut" }, 12.3);
    to("#trans", { y: 760, scale: 0.8, duration: 0.5, ease: "power3.inOut" }, 12.3);
    to("#mic", { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, 12.5);
    to("#micwave", { opacity: 1, duration: 0.3 }, 12.7);
    to(fx, { mic: 1, duration: 0.3 }, 12.75);
    to("#say", { y: 1400, opacity: 1, duration: 0.45, ease: "expo.out" }, 12.85);
    to("#mic", { scale: 1.04, duration: 0.9, ease: "none" }, 13.0);
    to("#mic,#micwave", { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, 14.0);
    to(fx, { mic: 0, duration: 0.2 }, 14.0);
    to("#say", { y: 1460, opacity: 0, duration: 0.3, ease: "power2.in" }, 14.0);
    to("#t1,#t2,#t3,#trans", { y: "-=200", opacity: 0, duration: 0.32, ease: "power2.in" }, 14.0);

    // S8 review 14.2–16.0
    to("#chip6", { opacity: 0, y: 390, duration: 0.18, ease: "power2.in" }, 14.1);
    to("#chip7", { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.7)" }, 14.32);
    to(rail, { active: 7, duration: 0.25 }, 14.3);
    to("#days", { y: 720, opacity: 1, duration: 0.5, ease: "expo.out" }, 14.25);
    to(fx, { dayHi: 3, duration: 0.45, ease: "power2.inOut" }, 14.7);
    to("#later", { opacity: 1, y: 880, duration: 0.4, ease: "expo.out" }, 14.95);
    to("#recall", { opacity: 1, y: 1070, duration: 0.45, ease: "expo.out" }, 15.05);
    to("#check", { scale: 1, duration: 0.35, ease: "back.out(2)" }, 15.4);
    to("#checkpath", { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, 15.48);
    to("#recall", { scale: 1.03, duration: 0.35, ease: "none" }, 15.45);
    to("#days,#later,#recall,#chip7", { opacity: 0, y: "-=70", duration: 0.32, ease: "power2.in", stagger: 0.03 }, 15.8);

    // S9 method 16.0–18.0
    to(rail, { dotsOp: 0, duration: 0.15 }, 15.8);
    to(arc, { x1: 960, y1: 540, x2: 960, y2: 1440, duration: 0.55, ease: "power3.inOut" }, 15.9);
    tl.set(rail, { active: 0 }, 16.0);
    to(rail, { dotsOp: 1, rowsOp: 1, duration: 0.35 }, 16.2);
    to("#s9title", { opacity: 1, y: 430, duration: 0.45, ease: "expo.out" }, 16.15);
    to(rail, { active: 7, duration: 1.05, ease: "none" }, 16.35);
    to("#s9title", { opacity: 0, y: 380, duration: 0.3, ease: "power2.in" }, 17.75);
    to(rail, { rowsOp: 0, dotsOp: 0, duration: 0.3, ease: "power2.in" }, 17.72);
    to(arc, { x1: 540, y1: 990, x2: 540, y2: 990, duration: 0.4, ease: "power3.in" }, 17.75);
    tl.set(arc, { op: 0 }, 18.15);
    to("#s3logo", { opacity: 0, duration: 0.25 }, 17.75);

    // S10 phone 18.0–19.8
    to("#phone", { y: 1040, rotation: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, 17.85);
    to("#pt1", { opacity: 1, y: 262, duration: 0.4, ease: "expo.out" }, 18.2);
    to(".hcard", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", stagger: 0.08 }, 18.35);
    to("#phone", { scale: 1.16, duration: 1.2, ease: "none" }, 18.55);
    to(fx, { petals: 0.12, duration: 0.4 }, 18.0);

    // S11 AI hub 19.8–22.0
    to("#hc3", { scale: 1.07, duration: 0.2, ease: "power2.out" }, 19.55);
    to("#pt1", { opacity: 0, y: 232, duration: 0.2, ease: "power2.in" }, 19.75);
    to("#pt2", { opacity: 1, y: 262, duration: 0.35, ease: "expo.out" }, 19.95);
    tl.set("#ovAI", { opacity: 1 }, 19.75);
    to("#ovAI", { left: 0, top: 0, width: 568, height: 1168, borderRadius: 74, duration: 0.45, ease: "power3.inOut" }, 19.78);
    to("#ovAI .ovhead", { opacity: 1, duration: 0.25 }, 20.15);
    to("#q", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }, 20.4);
    to("#cinput", { opacity: 1, y: 0, duration: 0.35, ease: "expo.out" }, 20.2);
    to("#ovAI .sug", { opacity: 1, y: 0, duration: 0.35, ease: "expo.out", stagger: 0.08 }, 20.3);
    to(fx, { typing: 1, duration: 0.15 }, 20.72);
    to(fx, { typing: 0, duration: 0.1 }, 21.1);
    tl.set("#ans", { opacity: 1 }, 21.15);
    to(fx, { ans: 1, duration: 0.6, ease: "none" }, 21.15);
    to("#ex", { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }, 21.6);
    to("#phone", { scale: 1.18, duration: 2.0, ease: "none" }, 19.8);

    // S12 planner 22.0–24.0
    to("#ovAI > *", { opacity: 0, duration: 0.1 }, 21.95);
    to("#ovAI", { left: 296, top: 576, width: 228, height: 260, borderRadius: 40, duration: 0.35, ease: "power3.inOut" }, 21.98);
    tl.set("#ovAI", { opacity: 0 }, 22.33);
    to("#hc3", { scale: 1, duration: 0.2 }, 22.2);
    to("#pt2", { opacity: 0, y: 232, duration: 0.2, ease: "power2.in" }, 22.0);
    to("#pt3", { opacity: 1, y: 262, duration: 0.35, ease: "expo.out" }, 22.2);
    to("#hc4", { scale: 1.07, duration: 0.15 }, 22.15);
    tl.set("#ovPlan", { opacity: 1 }, 22.28);
    to("#ovPlan", { left: 0, top: 0, width: 568, height: 1168, borderRadius: 74, duration: 0.42, ease: "power3.inOut" }, 22.28);
    to("#ovPlan > *", { opacity: 1, duration: 0.25, stagger: 0.05 }, 22.6);
    to(fx, { tasks: 3, duration: 0.9, ease: "none" }, 22.95);
    to("#phone", { scale: 1.2, duration: 2.0, ease: "none" }, 22.0);

    // S13 courses & books 24.0–26.0
    to("#ovPlan > *", { opacity: 0, duration: 0.1 }, 23.95);
    to("#ovPlan", { left: 44, top: 576, width: 228, height: 260, borderRadius: 40, duration: 0.35, ease: "power3.inOut" }, 23.98);
    tl.set("#ovPlan", { opacity: 0 }, 24.33);
    to("#hc4", { scale: 1, duration: 0.2 }, 24.2);
    to("#pt3", { opacity: 0, y: 232, duration: 0.2, ease: "power2.in" }, 24.0);
    to("#pt4", { opacity: 1, y: 262, duration: 0.35, ease: "expo.out" }, 24.2);
    to("#phone", { scale: 0.86, y: 1030, duration: 0.55, ease: "power3.inOut" }, 24.1);
    to("#course", { x: 285, y: 760, rotation: -7, scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" }, 24.35);
    to("#b1", { x: 830, y: 720, rotation: 7, scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" }, 24.45);
    to("#b2", { x: 865, y: 1020, rotation: 12, scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" }, 24.55);
    to("#b3", { x: 820, y: 1320, rotation: 17, scale: 1, opacity: 1, duration: 0.65, ease: "expo.out" }, 24.65);
    to("#course", { y: 740, rotation: -5, duration: 1.0, ease: "none" }, 25.0);
    to(".book", { y: "-=18", duration: 0.95, ease: "none" }, 25.3);

    // S14 converge 26.0–27.6
    to("#pt4", { opacity: 0, y: 232, duration: 0.2, ease: "power2.in" }, 25.9);
    to("#course,.book,#phone", { x: 540, y: 880, scale: 0.08, rotation: 0, opacity: 0, duration: 0.5, ease: "power3.in", stagger: 0.04 }, 25.95);
    to("#endlogo", { y: 640, scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" }, 26.35);
    to(fx, { petals: 0.8, duration: 0.6 }, 26.4);

    // S15 end card 27.6–30
    to("#endname", { y: 990, opacity: 1, duration: 0.5, ease: "expo.out" }, 26.85);
    to("#endcta", { y: 1100, opacity: 1, duration: 0.5, ease: "expo.out" }, 27.05);
    to("#endurl", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 27.3);
    to("#endig", { y: 1415, opacity: 1, duration: 0.45, ease: "expo.out" }, 27.55);
    tl.set(arc, { x1: 830, y1: 1500, x2: 250, y2: 1500, lift: 34, draw: 0, op: 1 }, 27.4);
    to(arc, { draw: 1, duration: 0.7, ease: "power2.inOut" }, 27.45);
    to("#s15", { scale: 1.03, duration: 3.0, ease: "none" }, 27.0);
    tl.set({}, {}, DUR);
    return tl;
  }

  // ---------- procedural layer ----------
  const arcPath = $("#arc"), arcDot = $("#arcdot");
  const sin = Math.sin, cos = Math.cos;
  const ANS = Array.from("هر دو نشانه‌ی موضوع‌اند؛ 은 بعد از حرف بی‌صدا، 는 بعد از حرف صدادار می‌آید.");
  const TRANS = Array.from("من کره‌ای یاد می‌گیرم.");

  function proc(t) {
    gsap.set("#blobA", { x: -260 + 90 * sin(t * 0.35), y: -120 + 70 * cos(t * 0.27) });
    gsap.set("#blobB", { x: 520 + 80 * cos(t * 0.31), y: 1180 + 90 * sin(t * 0.22) });
    gsap.set("#blobC", { x: 120 + 60 * sin(t * 0.18 + 1), y: 560 + 80 * cos(t * 0.24) });

    petals.forEach((p, i) => {
      const [x0, y0, v, sw, ph, r0, rv, sc] = PET[i];
      const y = ((y0 + t * v) % 2240) - 160;
      gsap.set(p, { x: x0 + sw * sin(t * 0.9 + ph), y, rotation: r0 + t * rv, scale: sc, opacity: fx.petals * (0.55 + 0.45 * sin(ph + t * 0.5) ** 2) });
    });

    // bridge arc / rail
    const mx = (arc.x1 + arc.x2) / 2, my = (arc.y1 + arc.y2) / 2;
    arcPath.setAttribute("d", `M ${arc.x1} ${arc.y1} Q ${mx} ${my + arc.lift * 2} ${arc.x2} ${arc.y2}`);
    const len = Math.max(arcPath.getTotalLength(), 0.01);
    arcPath.style.strokeDasharray = `${len} ${len}`;
    arcPath.style.strokeDashoffset = `${len * (1 - arc.draw)}`;
    arcPath.style.opacity = arc.op;
    if (arc.dotOp > 0) { const p = arcPath.getPointAtLength(len * arc.dot); arcDot.setAttribute("cx", p.x); arcDot.setAttribute("cy", p.y); }
    arcDot.style.opacity = arc.dotOp;

    dots.forEach((d, i) => {
      const f = i / 6;
      d.setAttribute("cx", arc.x1 + (arc.x2 - arc.x1) * f);
      d.setAttribute("cy", arc.y1 + (arc.y2 - arc.y1) * f);
      const on = clamp(rail.active - i);
      d.setAttribute("fill", on > 0.5 ? "#4f8a87" : "#ffffff");
      d.setAttribute("r", 13 + 5 * on);
      d.style.opacity = rail.dotsOp * arc.op;
    });
    stepRows.forEach((r, i) => { r.style.opacity = rail.rowsOp * (0.28 + 0.72 * clamp(rail.active - i)); });

    // pronunciation wave + mic wave
    wbars.forEach((b, i) => { b.style.height = `${12 + 54 * fx.wave * Math.abs(sin(t * 8.5 + i * 0.7)) * (0.55 + 0.45 * sin(i * 1.3 + t * 3.7))}px`; });
    mbars.forEach((b, i) => {
      const edge = 1 - Math.abs(i - 19.5) / 20;
      b.style.height = `${16 + 150 * fx.mic * edge * Math.abs(sin(t * 7.2 + i * 0.55)) * (0.5 + 0.5 * sin(i * 0.9 + t * 4.1))}px`;
    });
    ["#ring1", "#ring2"].forEach((s, k) => {
      const ph = ((t * 0.9 + k * 0.5) % 1);
      gsap.set(s, { scale: 1 + ph * 0.9, opacity: fx.mic * (1 - ph) * 0.7 });
    });

    // typing
    $("#trans").textContent = TRANS.slice(0, Math.round(TRANS.length * fx.typeT)).join("");
    $("#ans").textContent = ANS.slice(0, Math.round(ANS.length * fx.ans)).join("");
    $("#typing").style.opacity = fx.typing;
    $$("#typing i").forEach((d, i) => { d.style.transform = `translateY(${-8 * Math.max(0, sin(t * 12 - i * 0.9))}px)`; });

    // review day highlight
    const hi = Math.round(fx.dayHi);
    dayBoxes.forEach((d, i) => {
      const on = i === hi && t > 14.4;
      d.style.background = on ? "#4f8a87" : "#fff"; d.style.color = on ? "#fff" : ""; d.style.borderColor = on ? "#4f8a87" : "";
    });

    // planner tasks
    const done = Math.floor(fx.tasks + 0.001);
    ["#k1", "#k2", "#k3"].forEach((s, i) => $(s).classList.toggle("done", i < done));
    $("#progfill").style.width = `${(done / 3) * 100}%`;
  }

  let tl;
  window.seek = (t) => { tl.seek(t, false); proc(t); };
  window.DURATION = DUR;

  const families = ['700 40px "Vazirmatn"', '800 40px "Vazirmatn"', '500 40px "Vazirmatn"', '700 40px "Noto Serif KR"', '500 40px "Noto Sans KR"', '600 40px "Playfair Display"', 'italic 600 40px "Playfair Display"'];
  const sample = "안녕하세요 배우다 저는 한국어를 배워요 열심히 은 는 한 글 책 کره‌ای یاد بگیر KoreaFarsi koreafarsi.ir";
  Promise.all(families.map((f) => document.fonts.load(f, sample))).then(() => document.fonts.ready).then(() => {
    tl = build();
    const q = new URLSearchParams(location.search);
    if (q.has("play")) {
      const t0 = performance.now();
      const loop = () => { const t = ((performance.now() - t0) / 1000) % DUR; window.seek(t); requestAnimationFrame(loop); };
      loop();
    } else window.seek(parseFloat(q.get("t") || "0"));
    window.__ready = true;
  });
})();
