import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { parseAboutMarkdown, resolveAssetPath } from "@/lib/markdown-content";
import { ABOUT_FALLBACK } from "@/lib/portfolio-data";

type ResumeViewerContextValue = {
  /** Resolved URL of the resume PDF, or "" when none is configured. */
  resumeUrl: string;
  openResume: () => void;
  closeResume: () => void;
};

const ResumeViewerContext = createContext<ResumeViewerContextValue | null>(null);

export function ResumeViewerProvider({ children }: { children: ReactNode }) {
  const { data } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);
  const [open, setOpen] = useState(false);

  const resumeUrl = useMemo(() => resolveAssetPath(data.resumeLink), [data.resumeLink]);

  const openResume = useCallback(() => {
    if (!resumeUrl) return;
    setOpen(true);
  }, [resumeUrl]);

  const closeResume = useCallback(() => setOpen(false), []);

  // Lock the page behind the modal and allow Escape to dismiss it.
  useEffect(() => {
    if (!open || typeof document === "undefined") return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const value = useMemo<ResumeViewerContextValue>(
    () => ({ resumeUrl, openResume, closeResume }),
    [resumeUrl, openResume, closeResume],
  );

  return (
    <ResumeViewerContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && resumeUrl ? <ResumeModal url={resumeUrl} onClose={closeResume} /> : null}
      </AnimatePresence>
    </ResumeViewerContext.Provider>
  );
}

function ResumeModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      key="resume-viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
    >
      <button
        type="button"
        aria-label="Close resume"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-[rgb(0_0_0_/_0.55)] backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.99 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-warm bg-[color:var(--card)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
      >
        <div className="flex flex-none items-center justify-between gap-4 border-b border-warm px-5 py-4 md:px-7">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
              Document
            </div>
            <div className="truncate font-serif text-xl text-ink">
              Resume<span className="text-coral">.</span>
            </div>
          </div>

          <div className="flex flex-none items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-warm px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:text-coral sm:inline-flex"
            >
              <ExternalLink className="h-3 w-3" />
              New tab
            </a>
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)]"
            >
              <Download className="h-3 w-3" />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-warm text-ink transition-colors hover:border-coral hover:text-coral"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-[color:var(--background)]">
          <object data={url} type="application/pdf" className="h-full w-full">
            {/* Shown when the browser has no inline PDF viewer (common on mobile). */}
            <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
              <p className="max-w-sm font-serif text-lg leading-relaxed text-charcoal">
                Your browser can't display the PDF inline. You can open it in a new tab or download
                a copy instead.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--primary-foreground)]"
                >
                  Open resume
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={url}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-warm px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:border-coral hover:text-coral"
                >
                  Download
                  <Download className="h-3 w-3" />
                </a>
              </div>
            </div>
          </object>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function useResumeViewer() {
  const context = useContext(ResumeViewerContext);

  if (!context) {
    throw new Error("useResumeViewer must be used within ResumeViewerProvider.");
  }

  return context;
}

/**
 * Renders a resume link that opens the in-page viewer instead of navigating.
 * Falls back to a plain anchor so it still works without JavaScript.
 */
export function ResumeLink({ className, children }: { className?: string; children: ReactNode }) {
  const { resumeUrl, openResume } = useResumeViewer();

  if (!resumeUrl) return null;

  return (
    <a
      href={resumeUrl}
      onClick={(event) => {
        // Let modified clicks (new tab, download) behave natively.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        openResume();
      }}
      data-cursor="hover"
      className={className}
    >
      {children}
    </a>
  );
}
