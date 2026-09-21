import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2, RotateCcw, X } from "lucide-react";
import { useModalLock } from "@/hooks/use-modal-lock";

/**
 * Runs a live demo inside the portfolio, in a framed browser-like window.
 *
 * The demo is the real deployed application in an iframe — it signs itself in
 * against a sandboxed copy of its data via `?demo=1`. Both demo hosts were
 * checked to send no `X-Frame-Options` or frame-ancestors CSP, so embedding is
 * permitted.
 */

export type DemoModalTarget = {
  name: string;
  tagline: string;
  href: string;
  siteLabel: string;
  accentVar: string;
};

export function DemoModal({
  target,
  onClose,
}: {
  target: DemoModalTarget | null;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Bumped to force the iframe to remount, which restarts the demo.
  const [reloadKey, setReloadKey] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset per-demo state whenever a different demo is opened.
  useEffect(() => {
    if (!target) return;
    setLoaded(false);
    setExpanded(false);
    setReloadKey((key) => key + 1);
  }, [target]);

  // Locks the page (including Lenis, which ignores `overflow: hidden`), hands
  // the system cursor back over the iframe, and wires Escape to close.
  useModalLock({ open: Boolean(target), systemCursor: true, onEscape: onClose });

  useEffect(() => {
    if (!target) return;
    closeRef.current?.focus();
  }, [target]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {target ? (
        <motion.div
          key="demo-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${target.name} live demo`}
        >
          {/* Backdrop — clicking it closes, matching normal dialog behaviour. */}
          <motion.button
            type="button"
            aria-label="Close the demo"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default bg-[color:color-mix(in_oklab,var(--ink)_78%,transparent)] backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-warm bg-[color:var(--card)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55)] transition-[max-width,height] duration-300 ${
              expanded ? "h-[96vh] max-w-[98rem]" : "h-[88vh] max-w-7xl"
            }`}
          >
            {/* Title bar, styled as a browser chrome strip. */}
            <div className="flex shrink-0 items-center gap-3 border-b border-warm bg-[color:color-mix(in_oklab,var(--parchment)_70%,transparent)] px-4 py-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e26d5a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#a37153]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--muted-warm)] opacity-50" />
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex min-w-0 items-center gap-2 rounded-full border border-warm bg-[color:var(--card)] px-3 py-1">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: target.accentVar }}
                  />
                  <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-charcoal">
                    {target.siteLabel}
                  </span>
                </div>
                <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-warm sm:inline">
                  {target.tagline}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoaded(false);
                    setReloadKey((key) => key + 1);
                  }}
                  title="Restart the demo with fresh data"
                  aria-label="Restart the demo with fresh data"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-[color:color-mix(in_oklab,var(--coral)_14%,transparent)] hover:text-coral"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  title={expanded ? "Shrink" : "Expand"}
                  aria-label={expanded ? "Shrink the demo window" : "Expand the demo window"}
                  className="hidden h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-[color:color-mix(in_oklab,var(--coral)_14%,transparent)] hover:text-coral md:inline-flex"
                >
                  {expanded ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close the demo"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-[color:color-mix(in_oklab,var(--coral)_18%,transparent)] hover:text-coral"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-[color:var(--parchment)]">
              <AnimatePresence>
                {!loaded ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 z-10 grid place-items-center bg-[color:var(--card)]"
                  >
                    <div className="text-center">
                      <div
                        className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-t-transparent"
                        style={{ borderColor: target.accentVar, borderTopColor: "transparent" }}
                      />
                      <p className="mt-5 font-serif text-lg text-ink">
                        Waking up {target.name}
                        <span style={{ color: target.accentVar }}>...</span>
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-warm">
                        Building your private sandbox
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <iframe
                key={`${target.href}-${reloadKey}`}
                src={target.href}
                title={`${target.name} live demo`}
                onLoad={() => setLoaded(true)}
                className="h-full w-full border-0"
                // Everything the app needs, without granting top-level navigation
                // — an embedded demo must not be able to redirect the portfolio.
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
                allow="clipboard-write; fullscreen"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-warm bg-[color:color-mix(in_oklab,var(--parchment)_70%,transparent)] px-4 py-2.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-warm">
                Sandboxed demo · sample data · nothing here is real
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-warm">
                Press Esc to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
