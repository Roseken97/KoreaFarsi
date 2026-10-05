"use client";

import { motion } from "motion/react";
import { RobotIcon } from "@/components/icons";

/** Just the app's existing RobotIcon, enlarged and floating — placeholder until Rose sends her own character/photo. */
export function FloatingRobotIcon({ size = 96 }: { size?: number }) {
  return (
    <motion.div
      className="pointer-events-none grid place-items-center rounded-full bg-teal-mist text-teal-deep shadow-soft"
      style={{ width: size, height: size }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <RobotIcon width={size * 0.5} height={size * 0.5} />
    </motion.div>
  );
}
