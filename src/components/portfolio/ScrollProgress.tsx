import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.2,
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-0.5">
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="h-full w-full bg-coral"
      />
    </div>
  );
}
