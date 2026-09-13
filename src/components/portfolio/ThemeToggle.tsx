import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "portfolio:theme";

/** Reads the stored choice, falling back to the OS preference. */
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Private mode or blocked storage - fall through to the system preference.
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;

    // Keep the browser UI (address bar) in step with the page.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#191814" : "#e8dfca");

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Not fatal - the theme just won't persist across visits.
    }
  }, [theme]);

  // Follow the system while the visitor hasn't made an explicit choice.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (stored) return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "light" : "dark");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider.");
  return context;
}

/**
 * Theme switch, drawn as a press plate: the coral knob slides between the two
 * settings and the glyphs are struck rather than iconographic.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light" : "Dark"}
      className={`relative inline-flex h-8 w-[3.75rem] flex-none items-center rounded-full border border-warm bg-[color:color-mix(in_oklab,var(--card)_70%,transparent)] px-1 transition-colors duration-300 hover:border-coral ${className}`}
    >
      <motion.span
        aria-hidden
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-coral"
      >
        {/* Moon at dark, sun at light - drawn small so the plate stays quiet. */}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
          {isDark ? (
            <path
              d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
              fill="var(--primary-foreground)"
            />
          ) : (
            <g stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" fill="var(--primary-foreground)" stroke="none" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
            </g>
          )}
        </svg>
      </motion.span>

      {/* Track labels, so the control reads as a setting and not decoration. */}
      <span className="pointer-events-none flex w-full justify-between px-1.5 font-mono text-[8px] uppercase tracking-widest text-muted-warm">
        <span className={isDark ? "opacity-0" : "opacity-100"}>D</span>
        <span className={isDark ? "opacity-100" : "opacity-0"}>L</span>
      </span>
    </button>
  );
}
