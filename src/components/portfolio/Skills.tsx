import { motion } from "framer-motion";
import { GlowBlobs } from "./GlowBlobs";
import { SectionLabel } from "./SectionLabel";
import { useMarkdownData } from "@/hooks/use-markdown-data";
import { type SkillsGroup, parseSkillsMarkdown } from "@/lib/markdown-content";

const SKILLS_FALLBACK: SkillsGroup[] = [
  {
    category: "Frontend",
    subtitle: "React + Tailwind · Primary UI stack",
    items: ["React", "TypeScript", "JavaScript", "TailwindCSS", "Vite", "HTML/CSS", "Framer Motion"],
  },
  {
    category: "Backend",
    subtitle: "Python-first · FastAPI & Node.js",
    items: ["Python", "FastAPI", "Node.js", "Express", "REST APIs", "PostgreSQL", "SQLite"],
  },
  {
    category: "AI & ML",
    subtitle: "Growing focus · ML pipelines & integrations",
    items: [
      "Machine Learning",
      "Python (NumPy, Pandas, Scikit-learn)",
      "Data Pipelines",
      "Model Integration",
    ],
  },
  {
    category: "Tools & DevOps",
    subtitle: "Daily drivers · Git-heavy workflow",
    items: ["Git", "GitHub", "Docker (learning)", "VS Code", "Figma (basic)", "Vercel", "Linux"],
  },
];

export function Skills() {
  const { data: skills } = useMarkdownData("skills.md", parseSkillsMarkdown, SKILLS_FALLBACK);

  return (
    <section id="skills" className="relative py-32 md:py-44">
      <GlowBlobs blobs={[{ color: "coral", size: 420, top: "10%", left: "75%", opacity: 0.05 }]} />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel number="02" label="Capabilities" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
        >
          A toolkit shaped by years of <span className="editorial-italic text-coral">shipping</span>,
          not just experimenting<span className="text-coral">.</span>
        </motion.h2>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: gi * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-coral">
                  0{gi + 1}
                </span>
                <h3 className="font-serif text-xl text-ink">{group.category}</h3>
              </div>
              <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-muted-warm">
                {group.subtitle}
              </p>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: gi * 0.1 + i * 0.04 }}
                    className="rounded-full border border-warm px-3 py-1.5 font-mono text-[11px] tracking-wide text-charcoal transition-colors hover:border-coral hover:text-coral"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
