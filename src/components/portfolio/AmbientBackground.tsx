import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function AmbientBackground() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const mosaicX = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const mosaicY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const mosaicOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.04, 0.055, 0.05]);

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [0.07, 0]);

  const midY = useTransform(scrollYProgress, [0.2, 0.6], [0, 120]);
  const midOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0, 0.06, 0, 0]);

  const skillsOpacity = useTransform(scrollYProgress, [0, 0.4, 0.75, 1], [0, 0.05, 0, 0]);

  const contactOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [0, 0.06, 0.06]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        style={
          prefersReducedMotion
            ? { opacity: 0.05 }
            : {
                x: mosaicX,
                y: mosaicY,
                opacity: mosaicOpacity,
              }
        }
        className={`ambient-mosaic-layer ${prefersReducedMotion ? "" : "ambient-mosaic-drift"}`}
      />

      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : {
                y: heroY,
                opacity: heroOpacity,
              }
        }
        className="ambient-surface-orb-shell ambient-surface-orb-shell-hero"
      >
        <div
          className={`ambient-surface-orb ambient-surface-orb-hero ${
            prefersReducedMotion ? "" : "ambient-orb-drift-x"
          }`}
        />
      </motion.div>

      <motion.div
        style={
          prefersReducedMotion
            ? { opacity: 0.06 }
            : {
                y: midY,
                opacity: midOpacity,
              }
        }
        className="ambient-surface-orb ambient-surface-orb-mid"
      />

      <motion.div
        style={prefersReducedMotion ? { opacity: 0.05 } : { opacity: skillsOpacity }}
        className={`ambient-surface-orb ambient-surface-orb-skills ${
          prefersReducedMotion ? "" : "ambient-orb-pulse"
        }`}
      />

      <motion.div
        style={prefersReducedMotion ? { opacity: 0.06 } : { opacity: contactOpacity }}
        className={`ambient-surface-orb ambient-surface-orb-contact ${
          prefersReducedMotion ? "" : "ambient-orb-breathe"
        }`}
      />
    </div>
  );
}
