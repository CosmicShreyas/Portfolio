import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

const NAVBAR_OFFSET = -80;
const sectionIds = ["about", "skills", "projects", "experience", "contact"] as const;

export type PortfolioSectionId = (typeof sectionIds)[number];

type ScrollTarget = PortfolioSectionId | "top";

type SmoothScrollContextValue = {
  activeSection: PortfolioSectionId;
  scrollToSection: (target: ScrollTarget) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState<PortfolioSectionId>("about");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
    });

    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateActiveSection = () => {
      const marker = window.scrollY + 120;
      let nextActive = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        if (marker >= element.offsetTop) {
          nextActive = id;
        }
      }

      setActiveSection((current) => (current === nextActive ? current : nextActive));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      activeSection,
      scrollToSection: (target) => {
        if (typeof window === "undefined") return;

        if (target === "top") {
          if (prefersReducedMotion || !lenisRef.current) {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
            return;
          }

          lenisRef.current.scrollTo(0);
          return;
        }

        const element = document.getElementById(target);
        if (!element) return;

        if (prefersReducedMotion || !lenisRef.current) {
          const top = element.getBoundingClientRect().top + window.scrollY + NAVBAR_OFFSET;
          window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
          return;
        }

        lenisRef.current.scrollTo(element, { offset: NAVBAR_OFFSET });
      },
    }),
    [activeSection, prefersReducedMotion],
  );

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function usePortfolioScroll() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("usePortfolioScroll must be used within SmoothScroll.");
  }

  return context;
}
