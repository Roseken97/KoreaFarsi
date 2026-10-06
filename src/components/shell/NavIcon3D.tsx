import { useId } from "react";
import type { NavItem } from "./nav-items";

type Name = NavItem["labelKey"];
type Palette = { light: string; mid: string; dark: string; deep: string };

/** Soft grey "clay" for inactive tabs; each tab gets its own color once active, like the reference tab bar. */
const GREY: Palette = { light: "#fbfbfc", mid: "#d6d5dc", dark: "#a3a1ae", deep: "#76737f" };
export const NAV_PALETTE: Record<Name, Palette> = {
  planner: { light: "#fdf1df", mid: "#f8d4a6", dark: "#ebb574", deep: "#9a6418" },
  library: { light: "#fde4e4", mid: "#f8a8a8", dark: "#e98a8f", deep: "#b24e58" },
  home: { light: "#e6eafb", mid: "#a4b6f3", dark: "#7690ea", deep: "#4c5fb5" },
  dictionary: { light: "#e6f8f3", mid: "#aaeedd", dark: "#5fc9ad", deep: "#1f7a66" },
  account: { light: "#f0e7f9", mid: "#d1b6e7", dark: "#ae8ad2", deep: "#7550aa" },
};

/**
 * The app's five nav icons redrawn as small soft-3D objects (gradient bodies, a top highlight
 * and a ground shadow), grey when idle and in full color when active.
 */
export function NavIcon3D({ name, active, size }: { name: Name; active: boolean; size: number }) {
  const uid = useId();
  const p = active ? NAV_PALETTE[name] : GREY;
  const g = (k: string) => `${uid}-${k}`;
  const url = (k: string) => `url(#${g(k)})`;

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className="overflow-visible">
      <defs>
        <linearGradient id={g("body")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="100%" stopColor={p.mid} />
        </linearGradient>
        <linearGradient id={g("solid")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={p.mid} />
          <stop offset="100%" stopColor={p.dark} />
        </linearGradient>
        <linearGradient id={g("deep")} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={p.dark} />
          <stop offset="100%" stopColor={p.deep} />
        </linearGradient>
        <linearGradient id={g("paper")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9e8ee" />
        </linearGradient>
      </defs>

      <ellipse cx="24" cy="45" rx="14" ry="2.6" fill={p.deep} opacity={active ? 0.28 : 0.18} />

      {name === "home" && (
        <>
          <rect x="10" y="20" width="28" height="23" rx="5" fill={url("body")} />
          <rect x="20" y="29" width="8" height="14" rx="3" fill={url("deep")} />
          <path d="M24 5.5 43 20.5a2.6 2.6 0 0 1-3.2 4.1L24 12.3 8.2 24.6A2.6 2.6 0 0 1 5 20.5Z" fill={url("solid")} />
          <ellipse cx="17" cy="24.5" rx="4" ry="1.6" fill="#fff" opacity="0.6" />
        </>
      )}

      {name === "planner" && (
        <>
          <rect x="7" y="10" width="34" height="33" rx="7" fill={url("solid")} />
          <path d="M7 20h34v16a7 7 0 0 1-7 7H14a7 7 0 0 1-7-7Z" fill={url("paper")} />
          <rect x="14" y="6" width="5" height="9" rx="2.5" fill={url("deep")} />
          <rect x="29" y="6" width="5" height="9" rx="2.5" fill={url("deep")} />
          <path d="m17 31 5 5 9-10" fill="none" stroke={p.dark} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="16" cy="13.5" rx="5" ry="1.4" fill="#fff" opacity="0.45" />
        </>
      )}

      {name === "library" && (
        <>
          <rect x="7" y="12" width="10" height="31" rx="3" fill={url("body")} />
          <rect x="7" y="17" width="10" height="2.5" fill={p.dark} opacity="0.6" />
          <rect x="18" y="7" width="10" height="36" rx="3" fill={url("solid")} />
          <rect x="18" y="13" width="10" height="2.5" fill="#fff" opacity="0.55" />
          <g transform="rotate(14 35 27)">
            <rect x="30" y="11" width="10" height="32" rx="3" fill={url("deep")} />
            <rect x="30" y="17" width="10" height="2.5" fill="#fff" opacity="0.45" />
          </g>
          <ellipse cx="22" cy="9.5" rx="2.6" ry="1" fill="#fff" opacity="0.6" />
        </>
      )}

      {name === "dictionary" && (
        <>
          <rect x="9" y="6" width="30" height="37" rx="5" fill={url("solid")} />
          <rect x="12" y="35" width="27" height="6" rx="2" fill={url("paper")} />
          <rect x="9" y="6" width="6" height="37" rx="3" fill={url("deep")} />
          <text
            x="27"
            y="27"
            textAnchor="middle"
            fontSize="14"
            fontWeight="800"
            fill="#fff"
            fontFamily="'Apple SD Gothic Neo','Noto Sans KR',sans-serif"
          >
            가
          </text>
          <ellipse cx="25" cy="9.5" rx="8" ry="1.5" fill="#fff" opacity="0.45" />
        </>
      )}

      {name === "account" && (
        <>
          <path d="M8 41.5C9.6 32 16 26.5 24 26.5S38.4 32 40 41.5A2 2 0 0 1 38 43.5H10A2 2 0 0 1 8 41.5Z" fill={url("solid")} />
          <circle cx="24" cy="15" r="9" fill={url("body")} />
          <ellipse cx="20.5" cy="11" rx="3.5" ry="2" fill="#fff" opacity="0.7" />
          <ellipse cx="19" cy="30.5" rx="5" ry="1.4" fill="#fff" opacity="0.4" />
        </>
      )}
    </svg>
  );
}
