import { motion } from "framer-motion";
import { useRef } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type ProjectContent, parseProjectsMarkdown } from "@/lib/markdown-content";

const PROJECTS_FALLBACK: ProjectContent[] = [
  {
    label: "01 / PROFESSIONAL",
    title: "Vibgyor Presales Talktime",
    description:
      "A multi-surface presales system for Vibgyor spanning dashboard workflows, partner mapping, sales coordination, and a unified backend.",
    repo: "https://github.com/CosmicShreyas/Vibgyor-Presales-Talktime",
    live: "#",
    stack: ["JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    label: "02 / PROFESSIONAL",
    title: "Vibgyor Jarvis",
    description:
      "An AI quotation builder and conversational assistant tailored for Vibgyor's internal workflows.",
    repo: "https://github.com/CosmicShreyas/Vibgyor-Jarvis",
    live: "#",
    stack: ["TypeScript", "Python", "JavaScript", "HTML", "CSS"],
  },
];

function ProjectCard({ p, i }: { p: ProjectContent; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const hasLiveLink = p.live.trim() !== "" && p.live.trim() !== "#";

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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
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

      <div className="mt-8 flex items-center gap-5">
        <a
          href={p.repo}
          className="font-mono text-[11px] uppercase tracking-widest text-charcoal transition-colors hover:text-coral"
        >
          GitHub {"->"}
        </a>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const { data: projects } = useMarkdownData("projects.md", parseProjectsMarkdown, PROJECTS_FALLBACK);

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
          A handful of <span className="editorial-italic text-coral">recent</span> projects
          worth talking about<span className="text-coral">.</span>
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={`${p.label}-${p.title}`} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
