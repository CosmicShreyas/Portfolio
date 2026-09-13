import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type ProjectContent, parseProjectsMarkdown } from "@/lib/markdown-content";

const PROJECTS_FALLBACK: ProjectContent[] = [
  {
    label: "01 / IN DEVELOPMENT",
    title: "Pocket",
    description:
      "Pocket lets one person run a whole team of AI helpers from their phone or laptop, with a built-in Chief of Staff assistant keeping them organized and working together.",
    status: "In active development, nearing launch",
    repo: "",
    live: "",
    stack: ["React 19", "TanStack Start", "Node.js", "MongoDB", "AI Agents"],
  },
  {
    label: "02 / IN DEVELOPMENT",
    title: "NexPath",
    description:
      "An AI career advisor that talks you through career questions the way a real mentor would, plus a clean feed of relevant career and industry news.",
    status: "In final stages of development",
    repo: "",
    live: "",
    stack: ["React", "Node.js", "LLM Integration", "RAG Pipelines"],
  },
];

function ProjectCard({ p, i }: { p: ProjectContent; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const hasLiveLink = p.live.trim() !== "" && p.live.trim() !== "#";
  const hasRepoLink = p.repo.trim() !== "" && p.repo.trim() !== "#";

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateZ(0)`;
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
    }
  };

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="group relative block rounded-2xl border border-warm bg-[color:var(--card)] p-8 transition-[transform,border-color,box-shadow] duration-150 will-change-transform hover:border-coral hover:shadow-[0_30px_80px_-30px_color-mix(in_oklab,var(--coral)_50%,transparent)]"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-warm">
          {p.label}
        </span>
        {hasLiveLink ? (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] uppercase tracking-widest text-coral transition-colors hover:text-ink"
          >
            Live {"->"}
          </a>
        ) : null}
      </div>

      <h3 className="font-serif text-3xl leading-tight text-ink md:text-4xl">
        {p.title}
        <span className="text-coral">.</span>
      </h3>
      {p.status ? (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-coral/40 bg-[color:color-mix(in_oklab,var(--coral)_10%,transparent)] px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-coral">
            {p.status}
          </span>
        </div>
      ) : null}
      <p className="mt-4 max-w-prose font-serif text-base leading-relaxed text-charcoal">
        {p.description}
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {p.stack.map((t) => (
          <span
            key={t}
            className="rounded-full border border-warm px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-charcoal"
          >
            {t}
          </span>
        ))}
      </div>

      {hasRepoLink ? (
        <div className="mt-8 flex items-center gap-5">
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
          >
            GitHub {"->"}
          </a>
        </div>
      ) : null}
    </motion.article>
  );
}

/** Reads the category out of a "01 / PROFESSIONAL" style label. */
function categoryOf(project: ProjectContent) {
  const [, category = ""] = project.label.split("/");
  return category.trim() || "OTHER";
}

export function Projects() {
  const { data: projects } = useMarkdownData(
    "projects.md",
    parseProjectsMarkdown,
    PROJECTS_FALLBACK,
  );
  const [active, setActive] = useState("ALL");

  // Categories come from the data, so adding one in projects.md just works.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      const category = categoryOf(project);
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return [
      { key: "ALL", count: projects.length },
      ...[...counts.entries()].map(([key, count]) => ({ key, count })),
    ];
  }, [projects]);

  const visible = useMemo(
    () => (active === "ALL" ? projects : projects.filter((p) => categoryOf(p) === active)),
    [projects, active],
  );

  return (
    <section id="projects" className="relative py-32 md:py-44">
      <GlowBlobs
        blobs={[
          { color: "coral", size: 480, top: "5%", left: "-10%", opacity: 0.06 },
          { color: "gold", size: 380, top: "60%", left: "75%", opacity: 0.05, delay: 1.2 },
        ]}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="03" label="Selected Work" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
        >
          A handful of <span className="editorial-italic text-coral">recent</span> projects worth
          talking about<span className="text-coral">.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {filters.map((filter) => {
            const selected = active === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActive(filter.key)}
                aria-pressed={selected}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 ${
                  selected
                    ? "border-coral bg-[color:color-mix(in_oklab,var(--coral)_14%,transparent)] text-coral"
                    : "border-warm text-charcoal hover:border-coral hover:text-coral"
                }`}
              >
                {filter.key}
                <span className="text-[9px] opacity-60">{filter.count}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div layout className="grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={`${p.label}-${p.title}`} p={p} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
