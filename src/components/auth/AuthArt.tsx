import { useId } from "react";

/**
 * The auth screens' color field: Rose's periwinkle deepening to violet, with flowing lavender and
 * light blobs and a few glossy 3D spheres. Purely decorative; it fills (and crops to) its parent.
 */
export function AuthArt({ className = "" }: { className?: string }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  return (
    <svg viewBox="0 0 400 640" preserveAspectRatio="xMidYMin slice" className={`absolute inset-0 size-full rtl:-scale-x-100 ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#7690ea" />
          <stop offset="55%" stopColor="#5d72d0" />
          <stop offset="100%" stopColor="#3a4a93" />
        </linearGradient>
        <linearGradient id={id("light")} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#dfe5fb" />
          <stop offset="100%" stopColor="#7690ea" />
        </linearGradient>
        <linearGradient id={id("lav")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d1b6e7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ae8ad2" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={id("flow")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a4b6f3" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#4c5fb5" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={id("dark")} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#7690ea" />
          <stop offset="55%" stopColor="#3a4a93" />
          <stop offset="100%" stopColor="#1e2340" />
        </radialGradient>
        <radialGradient id={id("pearl")} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#dfe5fb" />
          <stop offset="100%" stopColor="#8fa3ee" />
        </radialGradient>
        <radialGradient id={id("blush")} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f5d6de" />
          <stop offset="100%" stopColor="#e3aebd" />
        </radialGradient>
      </defs>

      <rect width="400" height="640" fill={`url(#${id("bg")})`} />
      {/* soft lavender sweep from the top-left */}
      <path className="kf-sway" d="M-20 120C60 60 120 140 170 230S250 420 140 520 -40 560 -40 560V120Z" fill={`url(#${id("lav")})`} />
      {/* the big light wave at the top-right */}
      <g className="kf-sway" style={{ animationDelay: "-5s", animationDuration: "17s" }}>
        <path d="M210 -20C260 40 250 110 300 150S420 170 430 120V-20Z" fill={`url(#${id("light")})`} />
        <path d="M250 -20C300 30 290 80 330 100S420 110 430 80V-20Z" fill="#ffffff" opacity="0.35" />
      </g>
      {/* flowing band across the middle */}
      <path d="M-20 330C80 270 160 330 230 300S360 200 430 230V430C340 390 280 470 190 460S30 400 -20 440Z" fill={`url(#${id("flow")})`} />

      {/* spheres, each bobbing on its own beat */}
      <circle className="kf-float" style={{ animationDuration: "9s" }} cx="30" cy="40" r="78" fill={`url(#${id("dark")})`} />
      <g className="kf-float" style={{ animationDelay: "-2s" }}>
        <circle cx="300" cy="190" r="34" fill={`url(#${id("pearl")})`} />
        <ellipse cx="290" cy="178" rx="12" ry="7" fill="#ffffff" opacity="0.7" />
      </g>
      <circle className="kf-float" style={{ animationDelay: "-4s", animationDuration: "6s" }} cx="78" cy="400" r="24" fill={`url(#${id("blush")})`} />
      <circle className="kf-float" style={{ animationDelay: "-1s", animationDuration: "11s" }} cx="250" cy="560" r="70" fill={`url(#${id("dark")})`} />
      <circle className="kf-float" style={{ animationDelay: "-3s", animationDuration: "5s" }} cx="356" cy="420" r="9" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}
