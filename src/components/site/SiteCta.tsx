import Link from "next/link";

/** Pill links used at the foot of website pages: one solid (primary), the rest glass. */
export function SiteCta({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((l, i) => (
        <Link
          key={l.href}
          href={l.href}
          className={
            i === 0
              ? "rounded-full bg-white/90 px-6 py-3 text-[15px] font-extrabold text-[#1C1336] hover:bg-white"
              : "rounded-full border border-white/20 bg-white/[0.05] px-6 py-3 text-[15px] font-bold text-white hover:bg-white/[0.1]"
          }
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}
