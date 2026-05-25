import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type ExperienceEntry, parseExperienceMarkdown } from "@/lib/markdown-content";

const EXPERIENCE_FALLBACK: ExperienceEntry[] = [
  {
    kind: "experience",
    company: "Vibgyor",
    role: "Software Developer",
    dates: "2025 - PRESENT",
    bullets: [
      "Building internal tools and client-facing software for the interior design and presales workflow",
      "Developing Python and Node.js backends plus REST APIs for real-time communication features",
      "Owning large parts of the stack from database design to frontend delivery",
    ],
  },
  {
    kind: "education",
    company: "University",
    role: "Computer Science Student",
    dates: "",
    bullets: [
      "Studying core computer science concepts including programming, data structures, problem-solving, and software fundamentals",
      "Applying classroom learning through hands-on full-stack projects, automation work, and practical product building",
    ],
  },
];

export function Experience() {
  const { data: experience } = useMarkdownData(
    "experience.md",
    parseExperienceMarkdown,
    EXPERIENCE_FALLBACK,
  );

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="relative py-32 md:py-44">
      <GlowBlobs blobs={[{ color: "gold", size: 520, top: "20%", left: "60%", opacity: 0.05 }]} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="04" label="Experience" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
        >
          Years of <span className="editorial-italic text-coral">hands-on</span> building
          across products and systems<span className="text-coral">.</span>
        </motion.h2>

        <div ref={ref} className="relative pl-10 md:pl-20">
          <div className="absolute bottom-0 left-3 top-0 w-px bg-[color:var(--muted-warm)] opacity-25 md:left-8" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="ambient-timeline-glow absolute bottom-0 left-3 top-0 w-px bg-coral md:left-8"
          />

          <div className="space-y-16">
            {experience.map((e, i) => (
              <motion.div
                key={`${e.kind}-${e.company}-${e.role}`}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="absolute left-[-34px] top-2 flex h-3 w-3 items-center justify-center md:left-[-54px]">
                  {e.kind === "education" ? (
                    <span className="relative h-2.5 w-2.5 rotate-45 bg-gold ring-4 ring-[color:var(--background)]" />
                  ) : (
                    <>
                      <span className="absolute h-3 w-3 rounded-full bg-coral opacity-30 animate-ping" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-coral ring-4 ring-[color:var(--background)]" />
                    </>
                  )}
                </span>

                <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-serif text-2xl text-ink md:text-3xl">
                    {e.role} <span className="editorial-italic text-coral">@</span> {e.company}
                  </h3>
                  {e.dates ? (
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-warm">
                      {e.dates}
                    </span>
                  ) : null}
                  {e.kind === "education" ? (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-gold">
                      EDU
                    </span>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-2 font-serif text-base leading-relaxed text-charcoal">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span
                        className={`mt-2 h-1 w-3 flex-none ${
                          e.kind === "education" ? "bg-gold" : "bg-coral"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
