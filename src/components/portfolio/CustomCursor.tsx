import { useEffect, useRef, useState } from "react";

/**
 * The resting pointer: the coral arrow the site has always used.
 */
function CursorArrow() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <g filter="url(#cursor-shadow)">
        <path
          d="M10 7
             C10 5.6 11.5 4.8 12.7 5.6
             L34.6 20.5
             C36.1 21.5 35.6 23.8 33.8 24.1
             L25.9 25.4
             C25.1 25.6 24.7 26.4 25 27.1
             L31.3 39.1
             C31.9 40.2 31.5 41.5 30.4 42.1
             L27 43.9
             C25.9 44.5 24.5 44.1 23.9 43
             L17.8 31.1
             C17.4 30.3 16.4 30.1 15.7 30.6
             L11.7 33.6
             C10.5 34.5 8.9 33.6 8.9 32.1
             Z"
          fill="var(--coral)"
          stroke="var(--ink)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6 8.8 L31.4 21.6 L24.2 22.8"
          fill="none"
          stroke="color-mix(in oklab, var(--primary-foreground) 72%, transparent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}

/**
 * The hover pointer: a macOS-style pointing hand, drawn in the site's coral
 * with the same ink outline as the arrow so the two read as one set.
 */
function CursorHand({ pressed }: { pressed: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden>
      <g
        filter="url(#cursor-shadow)"
        style={{
          // A small press-in, the way the macOS hand dips when clicking.
          transform: pressed ? "translateY(1.5px) scale(0.95)" : "none",
          transformOrigin: "20px 12px",
          transition: "transform 160ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Palm and three folded fingers. */}
        <path
          d="M14 24
             V12.2
             C14 10.5 15.3 9.2 17 9.2
             C18.7 9.2 20 10.5 20 12.2
             V21.5
             V18.4
             C20 16.8 21.2 15.6 22.8 15.6
             C24.3 15.6 25.6 16.8 25.6 18.4
             V21.8
             V19.4
             C25.6 17.9 26.8 16.7 28.3 16.7
             C29.8 16.7 31 17.9 31 19.4
             V22
             V20.6
             C31 19.2 32.1 18.1 33.5 18.1
             C34.9 18.1 36 19.2 36 20.6
             V29.4
             C36 36.1 32 40.6 26 40.6
             C19.6 40.6 14 36.4 14 29.6
             V26.5
             L11.6 30.4
             C10.8 31.7 9.2 32 8.1 31.1
             C7.1 30.3 6.9 28.9 7.6 27.8
             Z"
          fill="var(--coral)"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Knuckle creases, as on the macOS hand. */}
        <g
          stroke="color-mix(in oklab, var(--ink) 55%, transparent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={pressed ? 0.3 : 0.6}
          style={{ transition: "opacity 160ms ease" }}
        >
          <path d="M20 25.2v-3" />
          <path d="M25.6 25.4v-2.9" />
          <path d="M31 25.6v-2.8" />
        </g>
      </g>
    </svg>
  );
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);
      const t = e.target as HTMLElement | null;
      const isInteractive = !!t?.closest(
        "a, button, input, textarea, select, [data-cursor='hover']",
      );
      setHovering(isInteractive);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const loop = () => {
      cx += (mx - cx) * 0.28;
      cy += (my - cy) * 0.28;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[12000] h-8 w-8 transition-opacity duration-200"
      style={{
        opacity: visible ? 1 : 0,
        // Both glyphs share a hotspot near the top-left, like a native cursor.
        marginLeft: hovering ? "-11px" : "-4px",
        marginTop: "-2px",
      }}
    >
      {/* One shared shadow definition for both glyphs. */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="cursor-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="rgba(0,0,0,0.28)" />
          </filter>
        </defs>
      </svg>

      {hovering ? <CursorHand pressed={pressed} /> : <CursorArrow />}
    </div>
  );
}
