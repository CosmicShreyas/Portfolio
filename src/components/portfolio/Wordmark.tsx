import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

/**
 * The wordmark. One idea only: the name, set in the display serif, with a coral
 * dot that inks a rule beneath it on hover - the way a nib lays down a line.
 * No eyebrow, no edition mark, no second typeface competing in 200px.
 */
export function Wordmark({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const active = hovered && !prefersReducedMotion;

  return (
    <span
      className="group relative inline-block select-none pb-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative font-serif text-[1.6rem] leading-none tracking-[-0.015em] text-ink">
        {name}
        {/* The ink well. It slides left along the rule it is drawing. */}
        <motion.span
          aria-hidden
          animate={{ x: active ? -3 : 0, scale: active ? 1.15 : 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="ml-[0.06em] inline-block text-coral"
        >
          .
        </motion.span>
      </span>

      {/* The rule, drawn from the dot's side back under the name. */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-right bg-coral"
      />
    </span>
  );
}
