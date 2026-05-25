import { useEffect, useRef, useState } from "react";

function CursorArrow({ hovering }: { hovering: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`h-full w-full transition-transform duration-200 ${hovering ? "scale-110 -rotate-6" : "rotate-0"}`}
      aria-hidden
    >
      <defs>
        <filter id="cursor-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="rgba(0,0,0,0.28)" />
        </filter>
      </defs>
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

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
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
      const isInteractive = !!t?.closest("a, button, input, textarea, select, [data-cursor='hover']");
      setHovering(isInteractive);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

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
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 transition-[opacity] duration-200"
      style={{
        opacity: visible ? 1 : 0,
        marginLeft: "-4px",
        marginTop: "-2px",
      }}
    >
      <CursorArrow hovering={hovering} />
    </div>
  );
}
