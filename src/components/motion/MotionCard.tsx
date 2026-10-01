"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import Link from "next/link";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

const MotionLink = motion.create(Link);

const SPRING = { type: "spring" as const, stiffness: 300, damping: 24 };

/**
 * Shared "modern/3D" card: fades+rises into view once, lifts on hover with a
 * subtle pointer-following tilt (desktop only — degrades to a plain lift on
 * touch), and settles on tap. Used everywhere a tappable card links out
 * (Home, Bookstore, Library, Courses) so the feel is consistent app-wide.
 */
export function MotionCard({
  href,
  className = "",
  style,
  children,
  tilt = true,
  onClick,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  tilt?: boolean;
  onClick?: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-7, 7]);

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <MotionLink
      href={href}
      onClick={onClick}
      className={className}
      style={tilt ? { ...style, rotateX, rotateY, transformPerspective: 800 } : style}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
    >
      {children}
    </MotionLink>
  );
}

/** Same entrance (+ optional hover lift) language for a card that isn't a single-link tap target (e.g. it has its own internal links/buttons, or is itself a toggle). */
export function MotionSurface({
  className = "",
  hover = true,
  onClick,
  children,
}: {
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={hover ? { y: -4 } : undefined}
      whileTap={onClick ? { scale: 0.96 } : undefined}
      transition={SPRING}
    >
      {children}
    </motion.div>
  );
}
