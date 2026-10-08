import styles from "./homepage.module.css";

/**
 * Stat like "+11K" drawn as vertical digit reels. Each reel holds 0–9 twice and rolls
 * one full turn from 0 to its digit when an ancestor gets `data-guided` (see blossom/guide.ts).
 * Screen readers get the plain value.
 */
export function Odometer({ value, delay = 0, className, style }: { value: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  const chars = Array.from(value);
  let d = 0;
  return (
    <span className={className} style={{ ...style, direction: "ltr" }}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
          const order = d++;
          return (
            <span key={i} className={styles.reelWindow}>
              <span
                className={styles.reel}
                style={{ "--to": `${-(10 + Number(ch)) * 5}%`, transitionDelay: `${delay + order * 0.12}s` } as React.CSSProperties}
              >
                {Array.from({ length: 20 }, (_, n) => (
                  <span key={n}>{n % 10}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
