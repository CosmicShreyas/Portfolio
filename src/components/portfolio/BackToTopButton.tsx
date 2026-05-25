import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { usePortfolioScroll } from "./SmoothScroll";

export function BackToTopButton() {
  const { scrollToSection } = usePortfolioScroll();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > 400);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => scrollToSection("top")}
          className="fixed right-6 bottom-6 z-[120] flex h-11 w-11 items-center justify-center rounded-full bg-coral text-[#191814] shadow-[0_12px_36px_-12px_color-mix(in_oklab,var(--coral)_65%,transparent)]"
          aria-label="Back to top"
        >
          <ChevronUp className="h-5 w-5 stroke-[2.6]" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
