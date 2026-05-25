import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePortfolioScroll } from "./SmoothScroll";
import { profile } from "@/lib/portfolio-data";

const links = [
  { label: "about", href: "#about", section: "about" },
  { label: "skills", href: "#skills", section: "skills" },
  { label: "work", href: "#projects", section: "projects" },
  { label: "experience", href: "#experience", section: "experience" },
  { label: "contact", href: "#contact", section: "contact" },
] as const;

export function Navbar() {
  const { activeSection, scrollToSection } = usePortfolioScroll();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousTouchAction = body.style.touchAction;

    if (mobileOpen) {
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.touchAction = previousTouchAction;
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleNavigate = (section: (typeof links)[number]["section"] | "top") => {
    scrollToSection(section);
    closeMobileMenu();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in oklab, var(--background) 70%, transparent)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <motion.a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              handleNavigate("top");
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-xl tracking-tight"
          >
            {profile.name.split(" ")[0]}
            <span className="text-coral">.</span>
          </motion.a>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
              >
                <a
                  href={l.href}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavigate(l.section);
                  }}
                  className={`group relative font-mono text-xs uppercase tracking-widest transition-colors ${
                    activeSection === l.section ? "text-coral" : "text-charcoal hover:text-ink"
                  }`}
                >
                  <span className="mr-1 text-coral">/</span>
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-coral transition-all duration-300 ${
                      activeSection === l.section ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center md:hidden"
          >
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-warm transition-colors hover:border-coral"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-4 w-4 text-ink" />
              ) : (
                <span className="flex flex-col gap-1.5">
                  <span className="h-px w-4 bg-ink" />
                  <span className="h-px w-4 bg-ink" />
                  <span className="h-px w-4 bg-ink" />
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] overflow-y-auto md:hidden"
          >
            <button
              type="button"
              aria-label="Close menu overlay"
              onClick={closeMobileMenu}
              className="absolute inset-0 h-full w-full bg-[rgb(25_24_20_/_0.97)]"
            />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-h-full flex-col justify-start px-8 pb-16 pt-28"
            >
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full border border-warm text-ink transition-colors hover:border-coral hover:text-coral"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-start gap-8 text-left">
                {links.map((link, index) => (
                  <motion.a
                    key={link.section}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index }}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavigate(link.section);
                    }}
                    className={`group relative font-mono text-xs uppercase tracking-widest transition-colors ${
                      activeSection === link.section ? "text-coral" : "text-charcoal hover:text-ink"
                    }`}
                  >
                    <span className="mr-1 text-coral">/</span>
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-coral transition-all duration-300 ${
                        activeSection === link.section ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
