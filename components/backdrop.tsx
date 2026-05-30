"use client";

import { motion } from "motion/react";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/use-environment";

// Mandatory orb layer — this is what the glass refracts. Without it the whole
// glass system is invisible. 4 blurred blue orbs on desktop, each a different
// blue, each on its own slow organic path. Do not "simplify" this away.
const ORBS = [
  {
    color: "#0066FF",
    size: 600,
    top: "2%",
    left: "8%",
    opacity: 0.55,
    x: [0, 140, -60, 0],
    y: [0, -90, 70, 0],
  },
  {
    color: "#3385FF",
    size: 700,
    top: "42%",
    left: "55%",
    opacity: 0.5,
    x: [0, -120, 80, 0],
    y: [0, 100, -70, 0],
  },
  {
    color: "#0052CC",
    size: 520,
    top: "62%",
    left: "12%",
    opacity: 0.6,
    x: [0, 160, -40, 0],
    y: [0, -60, 90, 0],
  },
  {
    color: "#1E40AF",
    size: 460,
    top: "12%",
    left: "68%",
    opacity: 0.65,
    x: [0, -100, 120, 0],
    y: [0, 80, -100, 0],
  },
];

export default function Backdrop() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  // Mobile: 2 orbs, heavier blur (cheaper at lower quality), slower motion.
  const orbs = isMobile ? ORBS.slice(0, 2) : ORBS;
  const blur = isMobile ? 160 : 120;
  const baseDuration = isMobile ? 34 : 20;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
            filter: `blur(${blur}px)`,
            opacity: orb.opacity,
            willChange: "transform",
          }}
          animate={reduced ? undefined : { x: orb.x, y: orb.y }}
          transition={
            reduced
              ? undefined
              : {
                  duration: baseDuration + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 3,
                }
          }
        />
      ))}
    </div>
  );
}
