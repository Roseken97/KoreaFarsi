import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
  </Base>
);

export const PlannerIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2.5" />
    <path d="M4 9.5h16M8.5 3.5v3M15.5 3.5v3" />
    <path d="m9 14.5 2 2 4-4" />
  </Base>
);

export const LibraryIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4.5h3.5v15H5zM10.5 4.5H14v15h-3.5z" />
    <path d="m16 5.6 3.3-.9 3 14-3.3.9z" />
  </Base>
);

export const DictionaryIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 3.5H18a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5z" />
    <path d="M5 17.5A1.5 1.5 0 0 1 6.5 16H19" />
    <path d="M9.5 7.5h2.5v3M9.5 10.5h3.2M14.5 7v5" />
  </Base>
);

export const AccountIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" />
  </Base>
);

export const EyeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </Base>
);

export const EyeOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M10.6 5.6A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.7 3.4M6.4 6.9C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.6 4.6-1.4" />
    <path d="M9.9 10a2.8 2.8 0 0 0 4 4M3.5 3.5l17 17" />
  </Base>
);

/** Points forward in reading direction (right in LTR, left in RTL). */
export const ArrowForwardIcon = ({ className = "", ...p }: IconProps) => (
  <Base className={`rtl:-scale-x-100 ${className}`} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
  </Base>
);

export const SparkleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5z" />
    <path d="M18.5 16v4M16.5 18h4" />
  </Base>
);

export const MailIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="m4.5 7 7.5 6 7.5-6" />
  </Base>
);

export function GoogleIcon(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" {...p}>
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

/* ── Milestone 2: Home + Account ─────────────────────────────── */

export const BooksStackIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="15" width="16" height="4.5" rx="1" />
    <rect x="5.5" y="10" width="13" height="5" rx="1" />
    <rect x="4.5" y="4.5" width="12" height="5.5" rx="1" />
    <path d="M8 17.2h6M9 12.5h5M7.5 7.2h5" />
  </Base>
);

export const ShoppingBagIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5.5 8h13l-1 11.5a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </Base>
);

export const RobotIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="8" width="15" height="11" rx="3.5" />
    <path d="M12 8V5M12 4.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
    <circle cx="9.3" cy="13" r="1" />
    <circle cx="14.7" cy="13" r="1" />
    <path d="M10 16.2h4M2.5 12.5v2M21.5 12.5v2" />
  </Base>
);

export const LanternIcon = (p: IconProps) => (
  // Traditional gate/lantern motif for Korea Life.
  <Base {...p}>
    <path d="M12 3v2.5" />
    <path d="M8.5 5.5h7l1.5 2H7z" />
    <path d="M7.5 7.5c-1 3.8-1 6.2 0 9h9c1-2.8 1-5.2 0-9" />
    <path d="M10 7.5c-.5 3.8-.5 6.2 0 9M14 7.5c.5 3.8.5 6.2 0 9" />
    <path d="M8.5 16.5h7l-1 2h-5zM12 18.5V21" />
  </Base>
);

export const BellIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.5 1.8 6 1.8 6H4.7s1.8-1.5 1.8-6z" />
    <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
  </Base>
);

export const SettingsIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A7.6 7.6 0 0 0 7 6.5l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a7.6 7.6 0 0 0 2.6-1.5l2.4 1 2-3.4z" />
  </Base>
);

/** Media controls are not mirrored in RTL (platform convention). */
export const PlayIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8.5 5.8v12.4a.8.8 0 0 0 1.2.7l9.6-6.2a.8.8 0 0 0 0-1.4L9.7 5.1a.8.8 0 0 0-1.2.7z" fill="currentColor" stroke="none" />
  </Base>
);

/** Row chevron that points "into" the item in reading direction. */
export const ChevronIcon = ({ className = "", ...p }: IconProps) => (
  <Base className={`rtl:-scale-x-100 ${className}`} {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Base>
);

export const GlobeIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z" />
  </Base>
);

export const HelpIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6M12 16.8v.2" />
  </Base>
);

export const TrophyIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 4.5h8v5a4 4 0 0 1-8 0z" />
    <path d="M8 6.5H5.5a2.5 2.5 0 0 0 2.6 3.2M16 6.5h2.5a2.5 2.5 0 0 1-2.6 3.2M12 13.5v3M8.5 20h7M9.5 16.5h5l.5 3.5h-6z" />
  </Base>
);

export const LogOutIcon = ({ className = "", ...p }: IconProps) => (
  <Base className={`rtl:-scale-x-100 ${className}`} {...p}>
    <path d="M10 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H10M14.5 8l4 4-4 4M18.5 12H9.5" />
  </Base>
);

export const PencilIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m14.5 5.5 4 4L9 19H5v-4z" />
    <path d="m12.5 7.5 4 4" />
  </Base>
);

export const WatchIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
    <path d="m10.5 9.5 4 2.5-4 2.5z" />
  </Base>
);

export const ReviewIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
    <path d="M19.5 4.5v4h-4" />
  </Base>
);

export const MicIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="3.5" width="6" height="11" rx="3" />
    <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3" />
  </Base>
);

export const FlameIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20.5c3.6 0 6-2.4 6-5.8 0-3.5-2.6-5.4-3.6-8.7-1.8 1.4-2.4 3.2-2.4 4.5-1-1-1.6-2.3-1.6-3.8C8 8.4 6 11.2 6 14.7c0 3.4 2.4 5.8 6 5.8z" />
  </Base>
);

export const StarIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.2l-4.8 2.6 1-5.4-4-3.7 5.4-.7z" />
  </Base>
);

export const LevelIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 19.5v-4M10 19.5v-8M15 19.5v-11M20 19.5V5" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z" />
  </Base>
);

export const PaletteIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.7 1.8-1.5 0-1.3-1.3-1.6-1.3-2.8 0-.9.7-1.5 1.6-1.5h2.2a4.2 4.2 0 0 0 4.2-4.2c0-3.9-3.8-7-8.5-7z" />
    <circle cx="8" cy="11" r="1" />
    <circle cx="11" cy="7.5" r="1" />
    <circle cx="15.5" cy="8.5" r="1" />
  </Base>
);

export const InstagramIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M16.8 7.2v.1" />
  </Base>
);

export const SendIcon = ({ className = "", ...p }: IconProps) => (
  <Base className={`rtl:-scale-x-100 ${className}`} {...p}>
    <path d="M20.5 3.5 3.5 10.8l6.8 2.9 2.9 6.8z" />
    <path d="m20.5 3.5-10.2 10.2" />
  </Base>
);

/* ── Milestone 3: Bookstore ─────────────────────────────────── */

export const SearchIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Base>
);

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const PlusIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Base>
);

export const MinusIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5.5 12h13" />
  </Base>
);

export const TrashIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5M10.5 11v5M13.5 11v5" />
  </Base>
);

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5.5 12.5 4 4 9-9" />
  </Base>
);

export const TagIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12.2V5a1 1 0 0 1 1-1h7.2l7.3 7.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z" />
    <circle cx="8.5" cy="8.5" r="1.3" />
  </Base>
);

export const LayersIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 4 8.5 4.5L12 13 3.5 8.5z" />
    <path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
  </Base>
);

/** Hangul glyph as an icon (Korean Alphabet collection). */
export const HangulIcon = (p: IconProps) => (
  <Base {...p}>
    <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="600" fill="currentColor" stroke="none">
      가
    </text>
  </Base>
);

/* ── Phase 2: Library ─────────────────────────────────────────── */

export const DownloadIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5v11M8 11l4 4 4-4" />
    <path d="M5 17.5v2a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-2" />
  </Base>
);
