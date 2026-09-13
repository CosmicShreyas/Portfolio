import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "cmdk";
import { usePortfolioScroll, type PortfolioSectionId } from "./SmoothScroll";
import { useResumeViewer } from "./ResumeViewer";
import { useTheme } from "./ThemeToggle";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import {
  parseAboutMarkdown,
  parseFiverrMarkdown,
  parseProjectsMarkdown,
  type FiverrContent,
  type ProjectContent,
} from "@/lib/markdown-content";
import { ABOUT_FALLBACK } from "@/lib/portfolio-data";

const SECTIONS: { id: PortfolioSectionId | "top"; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Selected Work" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "freelancing", label: "Freelancing" },
  { id: "contact", label: "Contact" },
];

const PROJECTS_EMPTY: ProjectContent[] = [];
const FIVERR_EMPTY: FiverrContent = {
  profileUrl: "",
  sellerLabel: "",
  headline: "",
  blurb: "",
  gigs: [],
};

/**
 * Quick navigation. Opens on Cmd/Ctrl+K or "/" and jumps to any section,
 * project or gig - the fastest route through a long single-page site.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { scrollToSection } = usePortfolioScroll();
  const { resumeUrl, openResume } = useResumeViewer();
  const { theme, toggleTheme } = useTheme();

  const { data: projects } = useMarkdownData("projects.md", parseProjectsMarkdown, PROJECTS_EMPTY);
  const { data: fiverr } = useMarkdownData("fiverr.md", parseFiverrMarkdown, FIVERR_EMPTY);
  const { data: about } = useMarkdownData("about.md", parseAboutMarkdown, ABOUT_FALLBACK);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;

      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        return;
      }

      // "/" is a familiar search shortcut, but never while typing in a field.
      if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Hold the page still behind the palette.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [open]);

  const run = (action: () => void) => {
    setOpen(false);
    // Let the palette close before the page moves under it.
    window.setTimeout(action, 80);
  };

  const itemClass =
    "flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 font-serif text-[0.95rem] text-charcoal data-[selected=true]:bg-[color:color-mix(in_oklab,var(--coral)_14%,transparent)] data-[selected=true]:text-ink";
  const metaClass = "font-mono text-[10px] uppercase tracking-widest text-muted-warm";

  const gigs = useMemo(() => fiverr.gigs.slice(0, 6), [fiverr.gigs]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[9500] flex items-start justify-center p-4 pt-[12vh]"
        >
          <button
            type="button"
            aria-label="Close command palette"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-[rgb(0_0_0_/_0.28)] backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-warm bg-[color:var(--card)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]"
          >
            <Command label="Site navigation" loop>
              <div className="flex items-center gap-3 border-b border-warm px-5">
                <span className="font-mono text-[11px] uppercase tracking-widest text-coral">
                  Go
                </span>
                <Command.Input
                  autoFocus
                  placeholder="Jump to a section, project, or gig"
                  className="h-14 w-full bg-transparent font-serif text-lg text-ink outline-none placeholder:text-muted-warm/70"
                />
                <kbd className="hidden flex-none rounded border border-warm px-1.5 py-0.5 font-mono text-[10px] text-muted-warm sm:block">
                  ESC
                </kbd>
              </div>

              <Command.List
                data-lenis-prevent
                className="palette-scroll max-h-[52vh] overflow-y-auto overscroll-contain p-2"
              >
                <Command.Empty className="px-3 py-6 text-center font-serif text-charcoal">
                  Nothing matches that.
                </Command.Empty>

                <Command.Group
                  heading="Sections"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-warm"
                >
                  {SECTIONS.map((section) => (
                    <Command.Item
                      key={section.id}
                      value={`section ${section.label}`}
                      onSelect={() => run(() => scrollToSection(section.id))}
                      className={itemClass}
                    >
                      <span>{section.label}</span>
                      <span className={metaClass}>Section</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                {projects.length ? (
                  <Command.Group
                    heading="Projects"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-warm"
                  >
                    {projects.map((project) => {
                      const target = project.live || project.repo;
                      return (
                        <Command.Item
                          key={project.title}
                          value={`project ${project.title} ${project.stack.join(" ")}`}
                          onSelect={() =>
                            run(() =>
                              target
                                ? window.open(target, "_blank", "noopener,noreferrer")
                                : scrollToSection("projects"),
                            )
                          }
                          className={itemClass}
                        >
                          <span className="truncate">{project.title}</span>
                          <span className={`${metaClass} flex-none`}>
                            {target ? "Open" : "View"}
                          </span>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                ) : null}

                {gigs.length ? (
                  <Command.Group
                    heading="Fiverr gigs"
                    className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-warm"
                  >
                    {gigs.map((gig) => (
                      <Command.Item
                        key={gig.link}
                        value={`gig ${gig.title} ${gig.tags.join(" ")}`}
                        onSelect={() =>
                          run(() => window.open(gig.link, "_blank", "noopener,noreferrer"))
                        }
                        className={itemClass}
                      >
                        <span className="truncate">{gig.title}</span>
                        <span className={`${metaClass} flex-none`}>Fiverr</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ) : null}

                <Command.Group
                  heading="Actions"
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-warm"
                >
                  {resumeUrl ? (
                    <Command.Item
                      value="open resume cv"
                      onSelect={() => run(openResume)}
                      className={itemClass}
                    >
                      <span>Open resume</span>
                      <span className={metaClass}>PDF</span>
                    </Command.Item>
                  ) : null}

                  <Command.Item
                    value="toggle theme dark light appearance"
                    onSelect={() => run(toggleTheme)}
                    className={itemClass}
                  >
                    <span>Switch to {theme === "dark" ? "light" : "dark"} theme</span>
                    <span className={metaClass}>Theme</span>
                  </Command.Item>

                  <Command.Item
                    value="email contact message"
                    onSelect={() => run(() => (window.location.href = `mailto:${about.email}`))}
                    className={itemClass}
                  >
                    <span>Email {about.email}</span>
                    <span className={metaClass}>Mail</span>
                  </Command.Item>

                  <Command.Item
                    value="github profile code"
                    onSelect={() =>
                      run(() => window.open(about.githubProfile, "_blank", "noopener,noreferrer"))
                    }
                    className={itemClass}
                  >
                    <span>GitHub profile</span>
                    <span className={metaClass}>External</span>
                  </Command.Item>

                  <Command.Item
                    value="linkedin profile"
                    onSelect={() =>
                      run(() => window.open(about.linkedinProfile, "_blank", "noopener,noreferrer"))
                    }
                    className={itemClass}
                  >
                    <span>LinkedIn profile</span>
                    <span className={metaClass}>External</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
