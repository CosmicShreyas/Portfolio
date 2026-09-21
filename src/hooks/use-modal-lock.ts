import { useEffect, useRef } from "react";
import { usePortfolioScroll } from "@/components/portfolio/SmoothScroll";

type ModalLockOptions = {
  /** Whether the dialog is currently open. */
  open: boolean;
  /**
   * Set for dialogs containing an `<iframe>`, `<object>` or `<embed>`.
   *
   * Those surfaces render in a separate context that swallows the parent
   * page's `mousemove`, so the custom cursor freezes at their edge and the
   * visitor is left with no pointer at all over the content. Handing the
   * system cursor back for the lifetime of the dialog is the only fix that
   * works, because the events never reach us to follow.
   */
  systemCursor?: boolean;
  /** Called when Escape is pressed. */
  onEscape?: () => void;
};

/**
 * The behaviour every popup on the site needs, in one place.
 *
 * Three things have to happen together, and each was previously done (or
 * missed) per-component:
 *
 * 1. **Stop Lenis.** `body { overflow: hidden }` alone is not enough: Lenis
 *    listens for wheel events on the window and scrolls the page from its own
 *    animation loop, so a wheel over the dialog scrolled the page behind it.
 * 2. **Lock the body**, so the scrollbar and any non-Lenis scrolling stop too.
 * 3. **Hand back the system cursor** over embedded surfaces (see above).
 */
export function useModalLock({ open, systemCursor = false, onEscape }: ModalLockOptions) {
  const { setScrollLocked } = usePortfolioScroll();

  // Held in a ref so callers can pass an inline arrow without it re-running the
  // effect on every render — which would release and re-take the scroll lock
  // continuously, and churn the body styles with it.
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;

  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    setScrollLocked(true);

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    if (systemCursor) {
      // Keyed off by the cursor rules in styles.css.
      body.dataset.systemCursor = "true";
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscapeRef.current?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      setScrollLocked(false);
      body.style.overflow = previousOverflow;
      if (systemCursor) delete body.dataset.systemCursor;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, systemCursor, setScrollLocked]);
}
