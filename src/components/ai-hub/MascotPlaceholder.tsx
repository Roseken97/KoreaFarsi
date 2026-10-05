import { useId } from "react";

/**
 * Soft-shaded take on the app's RobotIcon mascot (pearl body, yellow eyes, dark visor),
 * drawn to sit in the AI Hub cards like a 3D character render. Placeholder until the
 * real character art arrives — HubCard swaps it out as soon as a card gets an `image`.
 */
export function MascotPlaceholder({ wave = false, className = "" }: { wave?: boolean; className?: string }) {
  const id = useId();
  const body = `${id}-body`;
  const shade = `${id}-shade`;
  const visor = `${id}-visor`;
  const eye = `${id}-eye`;
  const joint = `${id}-joint`;

  return (
    <svg viewBox="0 0 200 250" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#ece8f3" />
          <stop offset="100%" stopColor="#a9a1bd" />
        </radialGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={visor} cx="40%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#4a4560" />
          <stop offset="100%" stopColor="#1d1a29" />
        </radialGradient>
        <radialGradient id={eye} cx="38%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff6b0" />
          <stop offset="55%" stopColor="#f6d33c" />
          <stop offset="100%" stopColor="#c99a10" />
        </radialGradient>
        <linearGradient id={joint} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5d5872" />
          <stop offset="100%" stopColor="#2c2839" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="100" cy="238" rx="52" ry="7" fill="#2a2733" opacity="0.18" />

      {/* legs, with dark striped joints like the reference render */}
      {[78, 122].map((x) => (
        <g key={x}>
          <rect x={x - 11} y="186" width="22" height="46" rx="11" fill={`url(#${body})`} />
          <rect x={x - 11} y="200" width="22" height="6" fill={`url(#${joint})`} />
          <rect x={x - 11} y="212" width="22" height="5" fill={`url(#${joint})`} />
          <ellipse cx={x} cy="232" rx="15" ry="6" fill={`url(#${joint})`} />
        </g>
      ))}

      {/* arms */}
      <g transform="rotate(18 52 150)">
        <rect x="40" y="140" width="20" height="50" rx="10" fill={`url(#${body})`} />
        <rect x="40" y="160" width="20" height="5" fill={`url(#${joint})`} />
      </g>
      <g transform={wave ? "rotate(-150 148 148)" : "rotate(-18 148 150)"}>
        <rect x="138" y="140" width="20" height="50" rx="10" fill={`url(#${body})`} />
        <rect x="138" y="160" width="20" height="5" fill={`url(#${joint})`} />
      </g>

      {/* torso */}
      <rect x="58" y="128" width="84" height="70" rx="30" fill={`url(#${body})`} />
      <rect x="68" y="132" width="50" height="16" rx="8" fill={`url(#${shade})`} opacity="0.7" />
      <circle cx="100" cy="168" r="8" fill="#20b8b0" opacity="0.85" />
      <circle cx="97.5" cy="165.5" r="2.5" fill="#ffffff" opacity="0.8" />

      {/* antenna */}
      <path d="M100 38 V18" stroke="#8f88a6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="15" r="7" fill={`url(#${eye})`} />

      {/* ears */}
      <rect x="34" y="70" width="18" height="34" rx="9" fill={`url(#${joint})`} />
      <rect x="148" y="70" width="18" height="34" rx="9" fill={`url(#${joint})`} />

      {/* head */}
      <rect x="44" y="36" width="112" height="96" rx="42" fill={`url(#${body})`} />
      <ellipse cx="82" cy="50" rx="26" ry="8" fill={`url(#${shade})`} />

      {/* visor + eyes */}
      <rect x="58" y="62" width="84" height="50" rx="24" fill={`url(#${visor})`} />
      <circle cx="83" cy="87" r="11" fill={`url(#${eye})`} />
      <circle cx="117" cy="87" r="11" fill={`url(#${eye})`} />
      <circle cx="79.5" cy="83" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="113.5" cy="83" r="3" fill="#ffffff" opacity="0.9" />
      <path d="M66 70 Q 80 64 96 66" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
